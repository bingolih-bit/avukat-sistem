// UYAP Otomatik Dosya İndirici - Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const openPanelBtn = document.getElementById('openPanel');
  const openUyapBtn = document.getElementById('openUyap');

  // Aktif sekmeyi kontrol et
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tab && tab.url && tab.url.includes('uyap.gov.tr')) {
    // UYAP sayfasındayız
    statusDiv.textContent = '✅ UYAP sayfasında - Hazır!';
    statusDiv.className = 'status active';
    openPanelBtn.disabled = false;
  } else {
    // UYAP sayfasında değiliz
    statusDiv.textContent = '⚠️ UYAP sayfasında değilsiniz';
    statusDiv.className = 'status inactive';
    openPanelBtn.disabled = false; // Yine de aktif bırak, uyarı gösterecek
  }

  // Panel aç butonu
  openPanelBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab || !tab.url || !tab.url.includes('uyap.gov.tr')) {
      alert('⚠️ Lütfen önce UYAP sayfasına gidin!\n\n1. UYAP\'a giriş yapın\n2. Bir dava dosyasına gidin\n3. Tekrar bu butona tıklayın');
      return;
    }

    try {
      // Content script'e panel toggle mesajı gönder
      await chrome.tabs.sendMessage(tab.id, { action: 'togglePanel' });
      window.close(); // Popup'ı kapat
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('❌ Panel açılamadı. Sayfayı yenileyip tekrar deneyin.');
    }
  });

  // UYAP'a git butonu
  openUyapBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://avukatbeta.uyap.gov.tr/giris' });
    window.close();
  });
});
