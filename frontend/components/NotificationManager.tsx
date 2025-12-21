'use client';

import { useEffect, useState } from 'react';
import { FaBell, FaBellSlash } from 'react-icons/fa';

export default function NotificationManager() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Notification permission durumunu kontrol et
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      checkSubscription();
    }
  }, []);

  const checkSubscription = async () => {
    if (!('serviceWorker' in navigator)) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      setIsSubscribed(!!subscription);
    } catch (error) {
      console.error('Abonelik kontrolü hatası:', error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('Tarayıcınız bildirimleri desteklemiyor');
      return false;
    }

    setLoading(true);

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);

      if (permission === 'granted') {
        await subscribeToPush();
        return true;
      } else {
        alert('Bildirim izni verilmedi. Ayarlardan bildirim izinlerini kontrol edin.');
        return false;
      }
    } catch (error) {
      console.error('Bildirim izni hatası:', error);
      alert('Bildirim izni alınamadı');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const subscribeToPush = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push messaging desteklenmiyor');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // VAPID public key (backend'den alınacak)
      // Şimdilik placeholder - backend kurulunca güncellenecek
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      // Backend'e subscription kaydet
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/api/push/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      setIsSubscribed(true);

      // Test bildirimi göster
      new Notification('🎉 Bildirimler Aktif!', {
        body: 'Artık önemli süre hatırlatmalarını alacaksınız.',
        icon: '/icon.svg',
        badge: '/icon.svg',
      });

      console.log('✅ Push bildirimlere abone olundu');
    } catch (error) {
      console.error('Push abonelik hatası:', error);
      alert('Bildirim sistemi başlatılamadı. Lütfen tekrar deneyin.');
    }
  };

  const unsubscribeFromPush = async () => {
    if (!('serviceWorker' in navigator)) return;

    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Backend'den subscription sil
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${apiUrl}/api/push/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(subscription),
        });

        setIsSubscribed(false);
        console.log('✅ Push bildirimlerden çıkıldı');
      }
    } catch (error) {
      console.error('Push abonelikten çıkma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribeFromPush();
    } else {
      if (notificationPermission === 'granted') {
        await subscribeToPush();
      } else {
        await requestNotificationPermission();
      }
    }
  };

  // Test bildirimi gönder
  const sendTestNotification = () => {
    if (notificationPermission !== 'granted') {
      alert('Önce bildirim izni vermelisiniz');
      return;
    }

    new Notification('🧪 Test Bildirimi', {
      body: 'Bu bir test bildirimidir. Bildirimler çalışıyor! ✅',
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      tag: 'test-notification',
      requireInteraction: false,
      data: { url: '/' },
    });
  };

  if (!('Notification' in window)) {
    return null; // Bildirim desteklenmiyor
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <FaBell className="text-green-600 text-2xl" />
          ) : (
            <FaBellSlash className="text-gray-400 text-2xl" />
          )}
          <div>
            <h3 className="font-semibold text-gray-800">
              Bildirimler {isSubscribed ? 'Aktif' : 'Kapalı'}
            </h3>
            <p className="text-sm text-gray-600">
              {isSubscribed
                ? 'Önemli süre hatırlatmaları alıyorsunuz'
                : 'Bildirim almak için aktif edin'}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isSubscribed && (
            <button
              onClick={sendTestNotification}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
            >
              Test
            </button>
          )}
          <button
            onClick={handleToggleNotifications}
            disabled={loading}
            className={`px-4 py-2 rounded font-semibold transition ${
              isSubscribed
                ? 'bg-red-50 hover:bg-red-100 text-red-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? '...' : isSubscribed ? 'Kapat' : 'Aktif Et'}
          </button>
        </div>
      </div>

      {/* iOS için özel not */}
      {/iPad|iPhone|iPod/.test(navigator.userAgent) && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <strong>📱 iOS Notu:</strong> Safari'de en iyi deneyim için uygulamayı ana ekrana
          ekleyin ve oradan açın.
        </div>
      )}
    </div>
  );
}
