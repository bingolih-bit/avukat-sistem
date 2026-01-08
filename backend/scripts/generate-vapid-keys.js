/**
 * VAPID Keys Generator
 *
 * Web Push bildirimleri için gerekli VAPID (Voluntary Application Server Identification)
 * anahtarlarını oluşturur.
 *
 * Kullanım:
 * node scripts/generate-vapid-keys.js
 *
 * Oluşan anahtarları .env dosyasına ekleyin:
 * VAPID_PUBLIC_KEY=<public-key>
 * VAPID_PRIVATE_KEY=<private-key>
 */

const webpush = require('web-push');

console.log('\n🔐 VAPID Anahtarları Oluşturuluyor...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID Anahtarları Oluşturuldu!\n');
console.log('📋 .env dosyanıza aşağıdaki satırları ekleyin:\n');
console.log('─'.repeat(80));
console.log(`VAPID_PUBLIC_KEY=${vapidKeys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${vapidKeys.privateKey}`);
console.log('─'.repeat(80));
console.log('\n⚠️  ÖNEMLİ: Private key\'i kimseyle paylaşmayın!\n');
console.log('💡 Public key\'i frontend .env dosyasına da eklemelisiniz:');
console.log(`   NEXT_PUBLIC_VAPID_PUBLIC_KEY=${vapidKeys.publicKey}\n`);
