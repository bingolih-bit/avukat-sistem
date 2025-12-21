const cron = require('node-cron');
const Deadline = require('../models/Deadline');
const { sendNotificationToAll } = require('../controllers/pushController');

/**
 * Hatırlatma Motoru - Akıllı Bildirim Sistemi
 *
 * Çalışma mantığı:
 * - Her saat başı (09:00-18:00 arası) süreleri kontrol eder
 * - Her sabah 08:00'de günlük özet gönderir
 * - Acil süreler için özel bildirimler
 * - Duruşmadan 1 saat önce hatırlatma
 */

// Süre kontrolü ve bildirim gönderme
async function checkAndSendNotifications() {
  try {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Tüm aktif süreleri çek
    const sureler = await Deadline.find({
      sonGun: { $gte: today }
    }).sort({ sonGun: 1 });

    if (sureler.length === 0) {
      console.log('⏰ Kontrol edilecek süre yok');
      return;
    }

    // Acil süreler (3 gün veya daha az)
    const acilSureler = sureler.filter(sure => sure.aciliyet === 'acil');

    if (acilSureler.length > 0) {
      console.log(`🚨 ${acilSureler.length} adet acil süre bulundu!`);

      for (const sure of acilSureler) {
        const kalanGun = sure.kalanGun;

        let title = '';
        let body = '';
        let requireInteraction = false;

        if (kalanGun === 0) {
          // BUGÜN SON GÜN
          title = '🔴 SON GÜN!';
          body = `${sure.baslik} - BUGÜN SON GÜN! ${sure.dosyaNo ? `(${sure.dosyaNo})` : ''}`;
          requireInteraction = true;
        } else if (kalanGun === 1) {
          // YARIN SON GÜN
          title = '⚠️ 1 Gün Kaldı!';
          body = `${sure.baslik} - Yarın son gün! ${sure.dosyaNo ? `(${sure.dosyaNo})` : ''}`;
          requireInteraction = true;
        } else if (kalanGun === 2) {
          // 2 GÜN KALDI
          title = '⚠️ 2 Gün Kaldı';
          body = `${sure.baslik} ${sure.dosyaNo ? `(${sure.dosyaNo})` : ''}`;
        } else if (kalanGun === 3) {
          // 3 GÜN KALDI
          title = '⏰ 3 Gün Kaldı';
          body = `${sure.baslik} ${sure.dosyaNo ? `(${sure.dosyaNo})` : ''}`;
        }

        if (title && body) {
          await sendNotificationToAll(title, body, {
            tag: `deadline-${sure._id}`,
            requireInteraction,
            url: '/',
            deadlineId: sure._id.toString()
          });
        }
      }
    }

    // Bugün duruşması olanlar
    const bugunDurusmalar = sureler.filter(sure => {
      if (sure.tur !== 'durusma') return false;

      const sonGunDate = new Date(sure.sonGun);
      const isSameDay = sonGunDate.toDateString() === today.toDateString();

      return isSameDay;
    });

    if (bugunDurusmalar.length > 0) {
      console.log(`⚖️ Bugün ${bugunDurusmalar.length} duruşma var`);

      for (const durusma of bugunDurusmalar) {
        const durusmaSaati = new Date(durusma.sonGun);
        const saatFarki = Math.floor((durusmaSaati - now) / (1000 * 60)); // dakika cinsinden

        // 1 saat önce hatırlat
        if (saatFarki >= 50 && saatFarki <= 70) {
          await sendNotificationToAll(
            '⚖️ Duruşma 1 Saat Sonra!',
            `${durusma.baslik} - ${durusma.mahkeme || 'Mahkeme'}`,
            {
              tag: `hearing-${durusma._id}`,
              requireInteraction: true,
              url: '/',
              deadlineId: durusma._id.toString()
            }
          );
        }

        // 15 dakika önce hatırlat
        if (saatFarki >= 10 && saatFarki <= 20) {
          await sendNotificationToAll(
            '🚨 Duruşma 15 Dakika Sonra!',
            `${durusma.baslik} - HAZIRLAYIN!`,
            {
              tag: `hearing-urgent-${durusma._id}`,
              requireInteraction: true,
              url: '/',
              deadlineId: durusma._id.toString()
            }
          );
        }
      }
    }

  } catch (error) {
    console.error('❌ Süre kontrolü hatası:', error);
  }
}

// Günlük özet raporu
async function sendDailySummary() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // İstatistikler
    const bugunSureler = await Deadline.countDocuments({
      sonGun: { $gte: today, $lt: tomorrow }
    });

    const acilSureler = await Deadline.countDocuments({
      aciliyet: 'acil',
      sonGun: { $gte: today }
    });

    const haftaSureler = await Deadline.countDocuments({
      sonGun: { $gte: today, $lt: nextWeek }
    });

    // Bugün duruşması olanlar
    const bugunDurusmalar = await Deadline.find({
      tur: 'durusma',
      sonGun: { $gte: today, $lt: tomorrow }
    }).sort({ sonGun: 1 });

    let body = `📊 Bugün: ${bugunSureler} süre, ${bugunDurusmalar.length} duruşma\n`;

    if (acilSureler > 0) {
      body += `🚨 ${acilSureler} acil süre var!\n`;
    }

    body += `📅 Bu hafta: ${haftaSureler} süre`;

    await sendNotificationToAll(
      '☀️ Günaydın! Bugünün Özeti',
      body,
      {
        tag: 'daily-summary',
        requireInteraction: false,
        url: '/'
      }
    );

    console.log('📨 Günlük özet gönderildi');

  } catch (error) {
    console.error('❌ Günlük özet hatası:', error);
  }
}

// Haftalık rapor
async function sendWeeklySummary() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sureler = await Deadline.find({
      sonGun: { $gte: today, $lt: nextWeek }
    }).sort({ sonGun: 1 });

    const durusmalar = sureler.filter(s => s.tur === 'durusma').length;
    const istinaflar = sureler.filter(s => s.tur === 'istinaf').length;
    const temyizler = sureler.filter(s => s.tur === 'temyiz').length;

    const body = `Bu hafta ${sureler.length} süreniz var:\n` +
      `⚖️ ${durusmalar} duruşma\n` +
      `📄 ${istinaflar} istinaf\n` +
      `📄 ${temyizler} temyiz`;

    await sendNotificationToAll(
      '📅 Haftalık Özet',
      body,
      {
        tag: 'weekly-summary',
        requireInteraction: false,
        url: '/'
      }
    );

    console.log('📨 Haftalık özet gönderildi');

  } catch (error) {
    console.error('❌ Haftalık özet hatası:', error);
  }
}

// Cron job'ları başlat
function startScheduler() {
  console.log('⏰ Hatırlatma motoru başlatılıyor...');

  // Her saat başı kontrol et (09:00-18:00 arası)
  cron.schedule('0 9-18 * * *', () => {
    console.log(`⏰ Saatlik süre kontrolü: ${new Date().toLocaleTimeString('tr-TR')}`);
    checkAndSendNotifications();
  });

  // Her 30 dakikada bir kontrol et (duruşma hatırlatmaları için)
  cron.schedule('*/30 * * * *', () => {
    console.log(`⏰ 30 dakikalık kontrol: ${new Date().toLocaleTimeString('tr-TR')}`);
    checkAndSendNotifications();
  });

  // Her sabah 08:00'de günlük özet
  cron.schedule('0 8 * * *', () => {
    console.log('☀️ Günlük özet gönderiliyor...');
    sendDailySummary();
  }, {
    timezone: 'Europe/Istanbul'
  });

  // Her Pazartesi 09:00'da haftalık özet
  cron.schedule('0 9 * * 1', () => {
    console.log('📅 Haftalık özet gönderiliyor...');
    sendWeeklySummary();
  }, {
    timezone: 'Europe/Istanbul'
  });

  console.log('✅ Hatırlatma motoru aktif!');
  console.log('   - Saatlik kontrol: 09:00-18:00');
  console.log('   - 30 dakikalık kontrol: 7/24');
  console.log('   - Günlük özet: Her sabah 08:00');
  console.log('   - Haftalık özet: Pazartesi 09:00');
}

module.exports = {
  startScheduler,
  checkAndSendNotifications,
  sendDailySummary,
  sendWeeklySummary
};
