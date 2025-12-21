const webpush = require('web-push');
const PushSubscription = require('../models/PushSubscription');

// VAPID keys - .env dosyasından alınacak
// İlk kurulumda generate-vapid-keys.js scripti çalıştırılmalı
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
};

// Web push ayarları
if (vapidKeys.publicKey && vapidKeys.privateKey) {
  webpush.setVapidDetails(
    'mailto:avukat@sistem.com', // İletişim emaili
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
}

// Subscription kaydet
exports.subscribe = async (req, res) => {
  try {
    const subscription = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz subscription bilgisi'
      });
    }

    // Var olan subscription'ı güncelle veya yeni oluştur
    await PushSubscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        userAgent: req.headers['user-agent'],
        active: true
      },
      { upsert: true, new: true }
    );

    console.log('✅ Push subscription kaydedildi:', subscription.endpoint.substring(0, 50) + '...');

    res.status(201).json({
      success: true,
      message: 'Bildirimler aktif edildi'
    });

  } catch (error) {
    console.error('❌ Subscription kayıt hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription kaydedilemedi',
      error: error.message
    });
  }
};

// Subscription iptal et
exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        message: 'Endpoint bilgisi gerekli'
      });
    }

    await PushSubscription.findOneAndUpdate(
      { endpoint },
      { active: false }
    );

    console.log('✅ Push subscription iptal edildi');

    res.json({
      success: true,
      message: 'Bildirimler kapatıldı'
    });

  } catch (error) {
    console.error('❌ Unsubscribe hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Subscription iptal edilemedi',
      error: error.message
    });
  }
};

// Test bildirimi gönder
exports.sendTestNotification = async (req, res) => {
  try {
    const subscriptions = await PushSubscription.find({ active: true });

    if (subscriptions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Aktif subscription bulunamadı'
      });
    }

    const payload = JSON.stringify({
      title: '🧪 Test Bildirimi',
      body: 'Backend bildirim sistemi çalışıyor!',
      icon: '/icon.svg',
      badge: '/icon.svg',
      tag: 'test-notification',
      data: { url: '/' }
    });

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.keys.p256dh,
              auth: sub.keys.auth
            }
          },
          payload
        )
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`✅ Test bildirimi gönderildi: ${successful} başarılı, ${failed} başarısız`);

    res.json({
      success: true,
      message: 'Test bildirimi gönderildi',
      stats: { successful, failed, total: subscriptions.length }
    });

  } catch (error) {
    console.error('❌ Test bildirimi hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Test bildirimi gönderilemedi',
      error: error.message
    });
  }
};

// Tüm aktif subscription'lara bildirim gönder
exports.sendNotificationToAll = async (title, body, data = {}) => {
  try {
    const subscriptions = await PushSubscription.find({ active: true });

    if (subscriptions.length === 0) {
      console.log('⚠️ Bildirim gönderilecek subscription yok');
      return { success: false, message: 'No active subscriptions' };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      tag: data.tag || 'notification',
      requireInteraction: data.requireInteraction || false,
      data: {
        url: data.url || '/',
        ...data
      }
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            },
            payload
          );

          // Son bildirim zamanını güncelle
          sub.lastNotificationSent = new Date();
          await sub.save();

          return { success: true };
        } catch (error) {
          // Eğer subscription geçersizse (410 veya 404), pasif yap
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log('⚠️ Geçersiz subscription, pasif yapılıyor');
            sub.active = false;
            await sub.save();
          }
          throw error;
        }
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`📨 Bildirim gönderildi: "${title}" - ${successful} başarılı, ${failed} başarısız`);

    return {
      success: true,
      stats: { successful, failed, total: subscriptions.length }
    };

  } catch (error) {
    console.error('❌ Toplu bildirim hatası:', error);
    return { success: false, error: error.message };
  }
};

// Subscription istatistikleri
exports.getStats = async (req, res) => {
  try {
    const total = await PushSubscription.countDocuments();
    const active = await PushSubscription.countDocuments({ active: true });
    const inactive = total - active;

    res.json({
      success: true,
      stats: {
        total,
        active,
        inactive
      }
    });

  } catch (error) {
    console.error('❌ Stats hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınamadı',
      error: error.message
    });
  }
};

// Export sendNotificationToAll for use in cron jobs
module.exports.sendNotificationToAll = exports.sendNotificationToAll;
