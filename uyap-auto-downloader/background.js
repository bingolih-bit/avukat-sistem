// UYAP Otomatik Dosya İndirici - Background Service Worker
// İndirme işlemlerini yönetir

// Mesajları dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'download') {
    handleDownload(request.url, request.filename)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Async response için
  }
});

// Dosya indirme
async function handleDownload(url, filename) {
  try {
    // Chrome Downloads API kullanarak indir
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: `UYAP_Downloads/${filename}`,
      saveAs: false, // Otomatik kaydet
      conflictAction: 'uniquify' // Aynı isimli dosya varsa numara ekle
    });

    console.log(`✅ İndirme başlatıldı: ${filename} (ID: ${downloadId})`);
    return downloadId;

  } catch (error) {
    console.error(`❌ İndirme hatası: ${filename}`, error);
    throw error;
  }
}

// İndirme durumunu izle
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.state && delta.state.current === 'complete') {
    console.log(`✅ İndirme tamamlandı: ID ${delta.id}`);
  } else if (delta.state && delta.state.current === 'interrupted') {
    console.error(`❌ İndirme kesintiye uğradı: ID ${delta.id}`);
  }
});

// Extension yüklendiğinde
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('🎉 UYAP Otomatik Dosya İndirici kuruldu!');

    // Karşılama sayfası aç
    chrome.tabs.create({
      url: chrome.runtime.getURL('welcome.html') // Opsiyonel
    });
  } else if (details.reason === 'update') {
    console.log('🔄 UYAP Otomatik Dosya İndirici güncellendi!');
  }
});

console.log('🚀 Background service worker hazır!');
