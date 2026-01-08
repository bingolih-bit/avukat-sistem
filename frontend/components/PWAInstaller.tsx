'use client';

import { useEffect, useState } from 'react';

export default function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  useEffect(() => {
    // Service Worker'ı kaydet
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('✅ Service Worker kaydedildi:', registration.scope);

            // Periyodik sync için permission (Chrome 80+)
            if ('periodicSync' in registration) {
              navigator.permissions.query({ name: 'periodic-background-sync' as any }).then((status) => {
                if (status.state === 'granted') {
                  // Her 12 saatte bir kontrol et
                  (registration as any).periodicSync.register('check-deadlines', {
                    minInterval: 12 * 60 * 60 * 1000, // 12 saat
                  }).catch((err: any) => console.log('Periodic sync error:', err));
                }
              }).catch(() => {
                // Permission API desteklenmiyor
              });
            }
          })
          .catch((err) => {
            console.error('❌ Service Worker kaydedilemedi:', err);
          });
      });
    }

    // PWA install prompt'u yakala
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Uygulama yüklendiyse butonu gizle
    window.addEventListener('appinstalled', () => {
      setShowInstallButton(false);
      console.log('✅ PWA yüklendi');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('✅ Kullanıcı PWA yüklemeyi kabul etti');
    } else {
      console.log('❌ Kullanıcı PWA yüklemeyi reddetti');
    }

    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  // iOS için manuel kurulum talimatı
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      // iOS'da standalone modda değilse talimat göster
      const hasSeenInstructions = localStorage.getItem('ios-install-instructions-seen');
      if (!hasSeenInstructions) {
        setShowIOSInstructions(true);
      }
    }
  }, []);

  const dismissIOSInstructions = () => {
    localStorage.setItem('ios-install-instructions-seen', 'true');
    setShowIOSInstructions(false);
  };

  return (
    <>
      {/* Android/Desktop için install butonu */}
      {showInstallButton && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 animate-slide-up">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">📱 Uygulamayı Yükle</h3>
              <p className="text-sm text-blue-100">
                Avukat Asistan'ı cihazınıza yükleyerek daha hızlı erişin ve bildirimler alın.
              </p>
            </div>
            <button
              onClick={() => setShowInstallButton(false)}
              className="text-white hover:text-blue-200 ml-2"
            >
              ✕
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstallClick}
              className="flex-1 bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition"
            >
              Yükle
            </button>
            <button
              onClick={() => setShowInstallButton(false)}
              className="px-4 py-2 rounded text-white hover:bg-blue-700 transition"
            >
              Şimdi Değil
            </button>
          </div>
        </div>
      )}

      {/* iOS için kurulum talimatları */}
      {showIOSInstructions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl p-6 max-w-md w-full animate-slide-up">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl text-gray-800">
                📱 iPhone'a Uygulama Ekle
              </h3>
              <button
                onClick={dismissIOSInstructions}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              <p className="text-sm">
                Avukat Asistan'ı iPhone ana ekranınıza ekleyerek uygulama gibi kullanabilirsiniz:
              </p>

              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span>
                    Safari'nin altındaki <strong>"Paylaş"</strong> butonuna{' '}
                    <span className="inline-block">
                      <svg className="w-4 h-4 inline" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                      </svg>
                    </span>{' '}
                    basın
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span>
                    Açılan menüden <strong>"Ana Ekrana Ekle"</strong> seçeneğini bulun
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>
                    <strong>"Ekle"</strong> butonuna basın
                  </span>
                </li>
              </ol>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                <p className="text-blue-800">
                  ✨ Ekledikten sonra ana ekrandaki simgeye basarak uygulama gibi kullanabilirsiniz!
                </p>
              </div>
            </div>

            <button
              onClick={dismissIOSInstructions}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
