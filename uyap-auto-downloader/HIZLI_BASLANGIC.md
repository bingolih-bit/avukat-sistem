# 🚀 HIZLI BAŞLANGIÇ

UYAP Otomatik Dosya İndirici'yi 5 dakikada kurun ve kullanmaya başlayın!

---

## ⚡ 3 ADIMDA KURULUM

### 1️⃣ Extension'ı Yükleyin (2 dk)

```
1. Chrome'da chrome://extensions/ adresine gidin
2. Sağ üstten "Developer mode" açın
3. "Load unpacked" tıklayın
4. uyap-auto-downloader klasörünü seçin
5. Tamam! 🎉
```

### 2️⃣ UYAP'a Girin (1 dk)

```
1. https://avukatbeta.uyap.gov.tr/giris
2. E-imza veya mobil imza ile giriş yapın
3. Bir dava dosyasına girin
4. "Evraklar" sekmesine tıklayın
```

### 3️⃣ Dosyaları İndirin (2 dk)

```
1. Extension ikonuna tıklayın (toolbar'da mor-mavi icon)
2. "İndirici Paneli Aç" butonuna basın
3. "🔍 Dosyaları Tara" yapın
4. "⬇️ İndirmeyi Başlat" tıklayın
5. Bitti! Dosyalar Downloads/UYAP_Downloads/ klasöründe 📁
```

---

## 📋 İLK KULLANIM ÖRNEĞİ

**Senaryo:** Diyarbakır 14. Asliye Hukuk dosyanızdaki 50 evrakı indirmek istiyorsunuz.

### Adım Adım:

1. **UYAP'ta dosyaya gidin:**
   ```
   Dosya Sorgula → Hukuk → Asliye Hukuk →
   → Diyarbakır 14. Asliye Hukuk → Dosya No girinDosya ayrıntılarında "Evraklar" sekmesine tıklayın
   ```

2. **Extension'ı açın:**
   - Toolbar'da extension ikonuna tıklayın
   - "İndirici Paneli Aç" → Panel sayfada belirecek

3. **Dosyaları tarayın:**
   - "🔍 Dosyaları Tara" butonuna bas
   - Sistem sayfadaki tüm evrakları bulacak (50 dosya)

4. **İndirmeyi yapın:**
   - "✓ Tümünü Seç" (veya sadece istediğinizi seçin)
   - Gecikme: 2000ms (varsayılan, değiştirmeyin)
   - "⬇️ İndirmeyi Başlat"

5. **Bekleyin:**
   - İlerleme çubuğu: 1/50, 2/50, 3/50...
   - Log ekranı: Hangi dosyanın indirildiğini gösterir
   - Toplam süre: ~2-3 dakika (50 dosya için)

6. **Tamamlandı!**
   ```
   📊 İndirme tamamlandı!
   ✅ Başarılı: 48
   ❌ Başarısız: 2 (log ekranında hangileri)
   ```

7. **Dosyalarınızı kontrol edin:**
   ```
   Windows: C:\Users\YourName\Downloads\UYAP_Downloads\
   Mac: ~/Downloads/UYAP_Downloads/
   ```

---

## ⚙️ İLK KULLANIMDA AYARLAR

### Gecikme Süresi

| Dosya Sayısı | Önerilen Gecikme | Toplam Süre (tahmini) |
|--------------|------------------|----------------------|
| 1-10 dosya   | 1000ms (1sn)     | ~10-15 saniye        |
| 10-30 dosya  | 2000ms (2sn)     | ~1-2 dakika          |
| 30-100 dosya | 3000ms (3sn)     | ~5-10 dakika         |
| 100+ dosya   | 5000ms (5sn)     | ~10-20 dakika        |

⚠️ **Önemli:** İlk kullanımda varsayılan 2000ms'yi değiştirmeyin!

---

## 🐛 İLK KULLANIMDA SORUNLAR

### "Panel açılmıyor"

✅ **Çözüm:**
- Sayfayı yenile (F5)
- Extension listesinde aktif olduğunu kontrol et
- Chrome'u yeniden başlat

### "Hiç dosya tespit edilmedi"

✅ **Çözüm:**
- "Evraklar" sekmesinde olduğunuzdan emin olun
- Sayfa tam yüklenene kadar bekleyin (5-10 saniye)
- "Dosyaları Tara" butonuna tekrar tıklayın

### "İndirme başlamıyor"

✅ **Çözüm:**
- Chrome ayarlarından Downloads iznini kontrol edin:
  ```
  chrome://extensions/ →
  → UYAP Otomatik Dosya İndirici →
  → Details → Permissions → Downloads (✓)
  ```

---

## 💡 İLK KULLANICI İÇİN İPUÇLARI

### ✅ YAPIN:

1. **İlk kez az sayıda dosya ile test edin** (5-10 dosya)
2. **UYAP oturumunuzun aktif olduğundan emin olun**
3. **İndirme sırasında tarayıcıyı açık tutun**
4. **Log ekranını kontrol edin** (hangi dosyalar başarısız)
5. **Başarısızları manuel indirin** (çok olmaması gerekir)

### ❌ YAPMAYIN:

1. ❌ İlk kullanımda 100+ dosya indirmeyin
2. ❌ Gecikme süresini çok düşük ayarlamayın (< 1000ms)
3. ❌ İndirme sırasında başka sekmelerde UYAP işlemi yapmayın
4. ❌ Aynı anda birden fazla indirme başlatmayın
5. ❌ UYAP oturumunuz biterse indirmeye devam etmeyin (tekrar giriş yapın)

---

## 📊 BAŞARI KRİTERLERİ

İlk kullanımınız başarılıysa:

- ✅ Extension yüklendi ve ikon görünüyor
- ✅ Panel UYAP sayfasında açıldı
- ✅ En az 1 dosya tespit edildi
- ✅ En az 1 dosya başarıyla indirildi
- ✅ Dosya Downloads klasöründe görünüyor

**Hepsi tamam mı? Tebrikler! Artık uzman kullanıcısınız! 🎉**

---

## 🆘 YARDIM

Hala sorun mu yaşıyorsunuz?

1. **README.md dosyasını okuyun** (detaylı bilgi)
2. **Chrome Console'u kontrol edin:**
   ```
   F12 → Console sekmesi → Hata var mı?
   ```
3. **Extension Console'u kontrol edin:**
   ```
   chrome://extensions/ →
   → UYAP Otomatik Dosya İndirici →
   → Errors (varsa gösterecek)
   ```

---

## 🎯 SONRAKİ ADIMLAR

Extension'ı başarıyla kullanmaya başladınız! Şimdi:

1. **README.md'yi okuyun** - Tüm özellikler için
2. **Kısayol tanımlayın** - Daha hızlı erişim için
3. **Paylaşın** - Meslektaşlarınız da faydalansın!

**İyi çalışmalar! ⚖️**
