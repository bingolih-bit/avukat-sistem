// UYAP Otomatik Dosya İndirici - Content Script
// UYAP sayfasında çalışır ve dosyaları tespit eder

let uyapPanel = null;
let detectedFiles = [];

// Desteklenen dosya uzantıları
const SUPPORTED_EXTENSIONS = ['.udf', '.pdf', '.tiff', '.tif', '.jpeg', '.jpg', '.png', '.html', '.htm', '.doc', '.docx', '.zip', '.rar'];

// Sayfada dosya linklerini tespit et
function detectFileLinks() {
  const files = [];
  const links = document.querySelectorAll('a[href]');

  links.forEach((link, index) => {
    const href = link.href;
    const text = link.textContent.trim();

    // Dosya uzantısı kontrolü
    const hasValidExtension = SUPPORTED_EXTENSIONS.some(ext =>
      href.toLowerCase().includes(ext) || text.toLowerCase().includes(ext)
    );

    // İndirme linki kontrolü (UYAP'ta genellikle download, evrak, dosya gibi kelimeler geçer)
    const isDownloadLink = /download|evrak|dosya|belge|ek|file/i.test(href) ||
                          /download|evrak|dosya|belge|ek|file/i.test(text);

    if (hasValidExtension || isDownloadLink) {
      // Dosya tipini belirle
      let fileType = 'Diğer';
      if (href.includes('.udf') || text.includes('.udf')) fileType = 'UDF';
      else if (href.includes('.pdf') || text.includes('.pdf')) fileType = 'PDF';
      else if (href.includes('.tiff') || href.includes('.tif') || text.includes('.tiff')) fileType = 'TIFF';
      else if (href.includes('.jpeg') || href.includes('.jpg') || text.includes('.jpeg') || text.includes('.jpg')) fileType = 'JPEG';
      else if (href.includes('.html') || href.includes('.htm')) fileType = 'HTML';
      else if (href.includes('.doc')) fileType = 'DOC';
      else if (href.includes('.zip') || href.includes('.rar')) fileType = 'ZIP';

      files.push({
        id: `file-${index}`,
        name: text || `Dosya ${index + 1}`,
        url: href,
        type: fileType,
        element: link
      });
    }
  });

  // onclick ile çalışan download butonları
  const buttons = document.querySelectorAll('button, input[type="button"], a[onclick]');
  buttons.forEach((btn, index) => {
    const onclick = btn.getAttribute('onclick') || '';
    const text = btn.textContent.trim();

    if (/download|indir|evrak|dosya/i.test(onclick) || /download|indir|evrak|dosya/i.test(text)) {
      // onclick içinden URL'yi çıkarmaya çalış
      const urlMatch = onclick.match(/['"](https?:\/\/[^'"]+)['"]/);
      if (urlMatch) {
        files.push({
          id: `btn-${index}`,
          name: text || `Belge ${index + 1}`,
          url: urlMatch[1],
          type: 'Bilinmeyen',
          element: btn,
          isButton: true
        });
      }
    }
  });

  return files;
}

// Panel oluştur
function createPanel() {
  if (uyapPanel) return; // Zaten varsa tekrar oluşturma

  uyapPanel = document.createElement('div');
  uyapPanel.id = 'uyap-auto-downloader-panel';
  uyapPanel.innerHTML = `
    <div class="uyap-panel-header">
      <h3>📁 UYAP Dosya İndirici</h3>
      <button id="uyap-close-panel">✕</button>
    </div>
    <div class="uyap-panel-body">
      <div class="uyap-stats">
        <span id="uyap-file-count">0 dosya tespit edildi</span>
      </div>
      <div class="uyap-actions">
        <button id="uyap-scan-files" class="uyap-btn uyap-btn-primary">🔍 Dosyaları Tara</button>
        <button id="uyap-select-all" class="uyap-btn">✓ Tümünü Seç</button>
        <button id="uyap-deselect-all" class="uyap-btn">✗ Tümünü Kaldır</button>
      </div>
      <div id="uyap-file-list" class="uyap-file-list"></div>
      <div class="uyap-download-section">
        <label>
          <input type="number" id="uyap-delay" min="500" max="10000" value="2000" step="500">
          <span>ms gecikme (indirmeler arası)</span>
        </label>
        <button id="uyap-start-download" class="uyap-btn uyap-btn-success">⬇️ İndirmeyi Başlat</button>
      </div>
      <div id="uyap-progress" class="uyap-progress" style="display: none;">
        <div class="uyap-progress-bar">
          <div id="uyap-progress-fill" class="uyap-progress-fill"></div>
        </div>
        <div id="uyap-progress-text">0 / 0</div>
      </div>
      <div id="uyap-log" class="uyap-log"></div>
    </div>
  `;

  document.body.appendChild(uyapPanel);

  // Event listeners
  document.getElementById('uyap-close-panel').addEventListener('click', () => {
    uyapPanel.style.display = 'none';
  });

  document.getElementById('uyap-scan-files').addEventListener('click', scanFiles);
  document.getElementById('uyap-select-all').addEventListener('click', selectAllFiles);
  document.getElementById('uyap-deselect-all').addEventListener('click', deselectAllFiles);
  document.getElementById('uyap-start-download').addEventListener('click', startDownload);
}

// Dosyaları tara
function scanFiles() {
  detectedFiles = detectFileLinks();
  updateFileList();
  addLog(`✅ ${detectedFiles.length} dosya tespit edildi`, 'success');
}

// Dosya listesini güncelle
function updateFileList() {
  const fileList = document.getElementById('uyap-file-list');
  const fileCount = document.getElementById('uyap-file-count');

  fileCount.textContent = `${detectedFiles.length} dosya tespit edildi`;

  if (detectedFiles.length === 0) {
    fileList.innerHTML = '<p class="uyap-no-files">Henüz dosya taranmadı. "Dosyaları Tara" butonuna tıklayın.</p>';
    return;
  }

  fileList.innerHTML = detectedFiles.map(file => `
    <div class="uyap-file-item">
      <input type="checkbox" id="${file.id}" data-file-id="${file.id}" checked>
      <label for="${file.id}">
        <span class="uyap-file-type">${file.type}</span>
        <span class="uyap-file-name">${file.name}</span>
      </label>
    </div>
  `).join('');
}

// Tümünü seç
function selectAllFiles() {
  const checkboxes = document.querySelectorAll('#uyap-file-list input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = true);
  addLog('✅ Tüm dosyalar seçildi', 'info');
}

// Tümünü kaldır
function deselectAllFiles() {
  const checkboxes = document.querySelectorAll('#uyap-file-list input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
  addLog('✗ Tüm seçimler kaldırıldı', 'info');
}

// İndirmeyi başlat
async function startDownload() {
  const checkboxes = document.querySelectorAll('#uyap-file-list input[type="checkbox"]:checked');
  const selectedFiles = Array.from(checkboxes).map(cb => {
    const fileId = cb.getAttribute('data-file-id');
    return detectedFiles.find(f => f.id === fileId);
  }).filter(f => f);

  if (selectedFiles.length === 0) {
    addLog('⚠️ Hiçbir dosya seçilmedi!', 'warning');
    return;
  }

  const delay = parseInt(document.getElementById('uyap-delay').value) || 2000;

  // Progress göster
  const progressDiv = document.getElementById('uyap-progress');
  const progressFill = document.getElementById('uyap-progress-fill');
  const progressText = document.getElementById('uyap-progress-text');
  progressDiv.style.display = 'block';

  addLog(`🚀 ${selectedFiles.length} dosya indiriliyor...`, 'info');

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];

    try {
      // Progress güncelle
      const progress = ((i + 1) / selectedFiles.length) * 100;
      progressFill.style.width = `${progress}%`;
      progressText.textContent = `${i + 1} / ${selectedFiles.length}`;

      if (file.isButton) {
        // Butona tıkla
        file.element.click();
        addLog(`🔘 ${file.name} - Buton tıklandı`, 'info');
      } else {
        // Background script'e mesaj gönder
        await chrome.runtime.sendMessage({
          action: 'download',
          url: file.url,
          filename: `${file.type}_${file.name.replace(/[^a-z0-9]/gi, '_')}`
        });
        addLog(`✅ ${file.name} - İndiriliyor`, 'success');
      }

      successCount++;

      // Gecikme
      if (i < selectedFiles.length - 1) {
        await sleep(delay);
      }

    } catch (error) {
      addLog(`❌ ${file.name} - Hata: ${error.message}`, 'error');
      failCount++;
    }
  }

  addLog(`\n📊 İndirme tamamlandı!\n✅ Başarılı: ${successCount}\n❌ Başarısız: ${failCount}`, 'info');
}

// Log ekle
function addLog(message, type = 'info') {
  const log = document.getElementById('uyap-log');
  const entry = document.createElement('div');
  entry.className = `uyap-log-entry uyap-log-${type}`;
  entry.textContent = `[${new Date().toLocaleTimeString('tr-TR')}] ${message}`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

// Sleep fonksiyonu
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Panel toggle için mesaj dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'togglePanel') {
    if (!uyapPanel) {
      createPanel();
    }
    uyapPanel.style.display = uyapPanel.style.display === 'none' ? 'block' : 'none';

    // Panel açıldığında otomatik tara
    if (uyapPanel.style.display === 'block' && detectedFiles.length === 0) {
      setTimeout(scanFiles, 500);
    }
  }
  sendResponse({ success: true });
});

// Sayfa yüklendiğinde panel oluştur (gizli olarak)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    createPanel();
    uyapPanel.style.display = 'none';
  });
} else {
  createPanel();
  uyapPanel.style.display = 'none';
}

console.log('✅ UYAP Otomatik Dosya İndirici yüklendi!');
