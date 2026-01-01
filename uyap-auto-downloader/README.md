# 📁 UYAP Otomatik Dosya İndirici

**Chrome Extension** - UYAP dava dosyalarındaki tüm belgeleri (UDF, PDF, TIFF, JPEG, HTML vb.) otomatik olarak indirir.

---

## ✨ ÖZELLİKLER

- ✅ **Otomatik Dosya Tespiti**: Sayfadaki tüm dosya linklerini otomatik bulur
- ✅ **Çoklu Format Desteği**: UDF, PDF, TIFF, JPEG, HTML, DOC, ZIP
- ✅ **Toplu İndirme**: İstediğiniz dosyaları seçin, tek tıkla hepsini indirin
- ✅ **İndirme Kuyruğu**: Dosyalar sırayla, kontrollü şekilde indirilir
- ✅ **Gecikme Ayarı**: UYAP sunucusuna yük binmemesi için ayarlanabilir gecikme
- ✅ **İlerleme Takibi**: Hangi dosyanın indirildiğini canlı takip edin
- ✅ **Hata Raporlama**: İndirilemeyenleri tespit edip raporlar
- ✅ **Düzenli İndirme**: Dosyalar "UYAP_Downloads" klasörüne otomatik organize edilir
- ✅ **100% Ücretsiz**: Açık kaynak, reklamsız
- ✅ **Gizlilik**: Tüm işlemler tarayıcınızda, hiçbir veri dışarı çıkmaz

---

## 🚀 KURULUM

### Adım 1: Extension Dosyalarını Hazırlayın

Bu klasörün tamamı extension dosyalarını içeriyor. Klasör yapısı:

```
uyap-auto-downloader/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Adım 2: Chrome'a Extension Yükleyin

1. **Chrome'u açın**

2. **Extension sayfasına gidin**:
   - Adres çubuğuna `chrome://extensions/` yazın
   - VEYA ⋮ menü → "Extensions" → "Manage Extensions"

3. **Developer Mode'u aktifleştirin**:
   - Sağ üst köşede "Developer mode" toggle'ını açın

4. **Extension'ı yükleyin**:
   - "Load unpacked" butonuna tıklayın
   - `uyap-auto-downloader` klasörünü seçin
   - "Seç" / "Select Folder" yapın

5. **Tamamlandı!** 🎉
   - Extension listesinde "UYAP Otomatik Dosya İndirici" görünmelidir
   - Toolbar'da mor-mavi gradient icon belirecek

---

## 📖 KULLANIM

### Hızlı Başlangıç

1. **UYAP'a giriş yapın**
   - https://avukatbeta.uyap.gov.tr/giris
   - E-imza veya mobil imza ile giriş

2. **Dava dosyasına gidin**
   - Dosya Sorgula → Hukuk → İstediğiniz dosya
   - Dosya içindeki "Evraklar" veya "Belgeler" sekmesine girin

3. **Extension'ı başlatın**
   - Toolbar'daki extension ikonuna tıklayın
   - "İndirici Paneli Aç" butonuna basın

4. **Dosyaları tarayın**
   - Panel sayfanın ortasında açılacak
   - "🔍 Dosyaları Tara" butonuna tıklayın
   - Tespit edilen dosyalar listelenecek

5. **İndirmeyi yapın**
   - İstediğiniz dosyaları seçin (veya "✓ Tümünü Seç")
   - Gecikme süresini ayarlayın (varsayılan 2000ms)
   - "⬇️ İndirmeyi Başlat" butonuna basın

6. **Takip edin**
   - İlerleme çubuğu ve log ekranından durumu izleyin
   - İndirilen dosyalar `Downloads/UYAP_Downloads/` klasörüne kaydedilir

---

## ⚙️ AYARLAR

### Gecikme Süresi (Download Delay)

**Ne işe yarar?**
- Her dosya indirme arasında beklenecek süre (milisaniye)
- UYAP sunucusuna aşırı yük binmemesi için önemli

**Önerilen değerler:**
- **500-1000ms**: Hızlı indirme (az sayıda dosya için)
- **2000ms**: Dengeli (varsayılan, önerilen) ⭐
- **5000ms+**: Yavaş ama güvenli (çok sayıda dosya için)

⚠️ **Uyarı**: Çok düşük gecikme (< 500ms) UYAP tarafından engellenmeye sebep olabilir!

---

## 🎯 DESTEKLENEN DOSYA TİPLERİ

Extension aşağıdaki dosya tiplerini otomatik tespit eder:

| Tip | Uzantı | Açıklama |
|-----|--------|----------|
| UDF | `.udf` | UYAP Doküman Formatı |
| PDF | `.pdf` | PDF Belgeleri |
| TIFF | `.tiff`, `.tif` | Taranmış Belgeler |
| JPEG | `.jpeg`, `.jpg` | Resim Dosyaları |
| PNG | `.png` | Resim Dosyaları |
| HTML | `.html`, `.htm` | Web Sayfaları |
| DOC | `.doc`, `.docx` | Word Belgeleri |
| ZIP | `.zip`, `.rar` | Sıkıştırılmış Dosyalar |

---

## 🔧 SORUN GİDERME

### Panel açılmıyor

**Çözüm:**
- Sayfayı yenileyin (F5)
- Extension'ı devre dışı bırakıp tekrar aktifleştirin
- Chrome'u yeniden başlatın

### Dosyalar tespit edilmiyor

**Çözüm:**
- "Evraklar" veya "Belgeler" sekmesinde olduğunuzdan emin olun
- Sayfayı tam yüklenene kadar bekleyin
- "Dosyaları Tara" butonuna tekrar tıklayın

### İndirme başlamıyor

**Çözüm:**
- Chrome izinlerini kontrol edin: `chrome://extensions/` → Extension → "Details" → Permissions
- "Downloads" izninin verildiğinden emin olun
- Pop-up blocker'ın kapalı olduğundan emin olun

### Bazı dosyalar indirilemiyor

**Sebepleri:**
- Dosya linki kırık olabilir
- UYAP oturumunuz sonlanmış olabilir (tekrar giriş yapın)
- Dosya erişim izniniz olmayabilir
- UYAP sunucusu geçici olarak yanıt vermeyebilir

**Çözüm:**
- Log ekranında hangi dosyaların başarısız olduğunu kontrol edin
- İndirilemeyenleri manuel olarak deneyin
- UYAP'a tekrar giriş yapın

### UYAP beni engelliyor

**Sebep:**
- Gecikme süresi çok düşük ayarlanmış
- Çok fazla dosyayı aynı anda indirmeye çalışıyorsunuz

**Çözüm:**
- Gecikme süresini artırın (3000-5000ms)
- Dosyaları gruplara ayırarak indirin
- 10-15 dakika bekleyip tekrar deneyin

---

## ⚠️ ÖNEMLİ UYARILAR

### Yasal Kullanım

- ✅ **SADECE kendi dava dosyalarınızda kullanın**
- ✅ UYAP kullanım şartlarına uygun hareket edin
- ❌ Başkalarının dosyalarına erişmeye çalışmayın
- ❌ UYAP sistemine zarar vermeyin

### Güvenlik

- 🔒 Extension sadece UYAP sayfalarında çalışır
- 🔒 Hiçbir veri dışarı gönderilmez
- 🔒 Tüm işlemler tarayıcınızda gerçekleşir
- 🔒 E-imza/mobil imza bilgilerinize erişmez

### Sorumluluk

- Extension, manuel olarak yapabileceğiniz işi otomatikleştirir
- UYAP'ın kullanım kurallarına uymak kullanıcının sorumluluğundadır
- Extension yazarı, kötüye kullanımdan sorumlu tutulamaz

---

## 🛠️ GELİŞTİRME

### Kaynak Kod

Extension açık kaynak kodludur. Dilediğiniz gibi inceleyebilir ve özelleştirebilirsiniz.

**Ana dosyalar:**
- `content.js`: UYAP sayfasında çalışan script
- `background.js`: Arka plan indirme yöneticisi
- `popup.js`: Extension popup'ı
- `styles.css`: Panel tasarımı

### Katkıda Bulunma

Katkılarınızı bekliyoruz! Özellik önerileri ve hata raporları için GitHub issues kullanabilirsiniz.

### Lisans

MIT License - Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.

---

## 📊 SÜRÜM GEÇMİŞİ

### v1.0.0 (2026-01-01)

İlk sürüm! 🎉

**Özellikler:**
- ✅ Otomatik dosya tespiti
- ✅ Toplu indirme
- ✅ İndirme kuyruğu
- ✅ İlerleme takibi
- ✅ Gecikme ayarı
- ✅ Hata raporlama
- ✅ 8+ dosya formatı desteği

---

## 💡 İPUÇLARI

### En İyi Performans İçin

1. **İndirmeden önce UYAP oturumunuzun aktif olduğundan emin olun**
2. **Çok sayıda dosya için (50+):**
   - Gecikme süresini 3000-5000ms yapın
   - Dosyaları gruplara ayırarak indirin
   - İndirmeler arası mola verin
3. **UDF dosyaları için:**
   - İndirdikten sonra PDF'e çevirmek için UYAP araçlarını kullanın
   - Veya üçüncü parti UDF→PDF dönüştürücüler kullanabilirsiniz

### Klavye Kısayolları

Extension'a hızlı erişim için Chrome klavye kısayolu tanımlayabilirsiniz:

1. `chrome://extensions/shortcuts` adresine gidin
2. "UYAP Otomatik Dosya İndirici" için kısayol tanımlayın
3. Örnek: `Ctrl+Shift+U`

---

## 🆘 DESTEK

### Sık Sorulan Sorular

**S: Extension ücretli mi?**
C: Hayır, tamamen ücretsiz ve açık kaynak.

**S: Verilerim güvende mi?**
C: Evet, hiçbir veri dışarı gönderilmez. Tüm işlemler tarayıcınızda.

**S: Edge/Brave/Opera'da çalışır mı?**
C: Evet, Chromium tabanlı tüm tarayıcılarda çalışır.

**S: UDF dosyalarını otomatik PDF'e çeviriyor mu?**
C: Hayır, şu anda sadece indirme yapıyor. PDF dönüşümü gelecek versiyonda.

**S: UYAP mobil uygulamasında çalışır mı?**
C: Hayır, sadece web tarayıcılarında çalışır.

---

## 📞 İLETİŞİM

Sorularınız, önerileriniz veya hata raporlarınız için:

- 📧 Email: [email protected]
- 🐛 Issues: GitHub Issues
- 💬 Tartışmalar: GitHub Discussions

---

## 🎉 TEŞEKKÜRLER

UYAP Otomatik Dosya İndirici'yi kullandığınız için teşekkürler!

Avukatlık mesleğine katkıda bulunmak ve iş yükünüzü azaltmak için tasarlandı.

**İyi çalışmalar! ⚖️**

---

**Not:** Bu extension, UYAP veya T.C. Adalet Bakanlığı ile hiçbir şekilde bağlantılı değildir. Bağımsız bir açık kaynak projedir.
