# 📖 KULLANIM KILAVUZU

## İLK KURULUM (Sadece Bir Kez)

### 1. ÖN HAZIRLIK (5 dakika)

#### a) Node.js Yükle
1. https://nodejs.org/ adresine git
2. "LTS" versiyonu indir ve yükle
3. Terminal/Komut İstemi'nde test et:
   ```bash
   node --version
   # v18.0.0 veya üzeri görmeli
   ```

#### b) MongoDB Atlas Hesabı Aç (ÜCRETSİZ)
1. https://www.mongodb.com/cloud/atlas/register
2. Email ile kayıt ol
3. "Build a Database" → "M0 FREE" seç
4. Region: Frankfurt (en yakın)
5. Cluster Name: `avukat-sistem`
6. "Create" butonuna bas

#### c) Database Kullanıcısı Oluştur
1. Sol menüden "Security" → "Database Access"
2. "Add New Database User"
   - Username: `avukat_admin`
   - Password: Güçlü şifre (KAYDET!)
   - Role: "Atlas admin"
3. "Add User"

#### d) IP Adresini Ekle
1. Sol menüden "Security" → "Network Access"
2. "Add IP Address"
3. "Allow Access from Anywhere" → Confirm
   - (Bu geliştirme için, production'da değiştirebilirsin)

#### e) Bağlantı String'ini Al
1. Sol menüden "Database" → "Connect"
2. "Connect your application"
3. Driver: Node.js, Version: 5.5+
4. Connection string'i KOPYALA:
   ```
   mongodb+srv://avukat_admin:<password>@cluster...
   ```
   **ÖNEMLİ:** `<password>` yerine oluşturduğun şifreyi yaz!

---

### 2. PROJEYİ KURMA (10 dakika)

#### a) Dosyaları Hazırla
1. İndirdiğin `avukat-sistem` klasörünü masaüstüne kopyala

#### b) Backend .env Dosyasını Oluştur
1. Terminal/Komut İstemi'ni aç
2. Proje klasörüne git:
   ```bash
   cd Desktop/avukat-sistem/backend
   ```
3. .env dosyası oluştur:
   - **Mac/Linux:**
     ```bash
     cp .env.example .env
     nano .env
     ```
   - **Windows:**
     ```bash
     copy .env.example .env
     notepad .env
     ```
4. Dosyayı düzenle:
   ```env
   MONGODB_URI=mongodb+srv://avukat_admin:SIFREN@cluster...
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   ```
   **ÖNEMLİ:** MongoDB Atlas'tan aldığın connection string'i yapıştır!

5. Kaydet ve kapat

#### c) Paketleri Yükle
```bash
# Backend klasöründeyken:
npm install

# Sonra frontend'e git:
cd ../frontend
npm install
```

✅ Kurulum tamam!

---

### 3. SİSTEMİ BAŞLATMA (Her Kullanımda)

#### İki Terminal Aç

**Terminal 1 - Backend:**
```bash
cd Desktop/avukat-sistem/backend
npm start
```
Şunu görmelisin:
```
✅ MongoDB bağlantısı başarılı
🚀 Server 3001 portunda çalışıyor
```

**Terminal 2 - Frontend:**
```bash
cd Desktop/avukat-sistem/frontend
npm run dev
```
Şunu görmelisin:
```
ready - started server on 0.0.0.0:3000
```

#### Tarayıcıda Aç
- http://localhost:3000

🎉 **SİSTEM ÇALIŞIYOR!**

---

## GÜNLÜK KULLANIM

### 1. Süre Ekleme

#### Duruşma Ekle
1. "📅 Süreler" sekmesinde
2. "+ Yeni Süre Ekle" butonuna bas
3. Formu doldur:
   - Başlık: "Ahmet Yılmaz - Duruşma"
   - Süre Türü: Duruşma
   - Dosya No: 2024/123
   - Mahkeme: Ankara 5. Asliye Ceza
   - Son Gün: 15.01.2025 09:00
   - Notlar: Tanık listesi hazırla
4. "Süre Ekle"

#### İstinaf/Temyiz Ekle (OTOMATIK HESAPLAMA)
1. "+ Yeni Süre Ekle"
2. Süre Türü: **İstinaf Süresi** seç
3. **Tebligat Tarihi:** 10.12.2024
4. 👉 **Son Gün otomatik hesaplanır!** (resmi tatil + hafta sonu dahil)
5. "Süre Ekle"

**Sistem kendisi hesaplar:**
- İstinaf: 2 hafta (14 iş günü)
- Temyiz: 1 ay (30 iş günü)
- Resmi tatilleri atlar
- Hafta sonlarını atlar

### 2. Görev Ekleme

1. "✅ Yapılacaklar" sekmesine geç
2. "+ Görev Ekle"
3. Formu doldur:
   - Başlık: "Tanık listesi hazırla"
   - Açıklama: "3 tanık bilgilerini topla"
   - Öncelik: Yüksek
   - Tarih: Bugün
   - Saat: 17:00
   - Dosya: 2024/123
4. "Görev Ekle"

### 3. Görev Tamamlama

- Görevin solundaki **checkbox'a tıkla** ✅
- Görev otomatik olarak "Tamamlanan" bölümüne geçer
- İstatistikler güncellenir

### 4. Dashboard'u Anlama

**İstatistik Kartları:**
- 🔴 **Acil:** 3 gün veya daha az süre kalan
- 🟡 **Yakın:** 4-7 gün arası süre kalan
- ✅ **Aktif Görevler:** Tamamlanmamış görevler
- 📊 **Toplam:** Tüm aktif süreler

**Renk Kodları:**
- Kırmızı arka plan: ACİL (hemen harekete geç!)
- Turuncu arka plan: YAKIN (hazırlık yap)
- Yeşil arka plan: GÜVENLİ (rahat nefes al)

---

## AKILLI İPUCLARI

### Sabah Rutini (5 dakika)
1. Sistemi aç
2. Dashboard'a bak
3. Acil süreleri kontrol et (kırmızılar)
4. Bugünkü görevleri gözden geçir
5. Yeni görevler varsa ekle

### Tebligat Geldiğinde (2 dakika)
1. Hemen "+ Yeni Süre Ekle" bas
2. Tebligat tarihini gir
3. Süre türünü seç (İstinaf/Temyiz)
4. **Son gün otomatik hesaplanır!**
5. Kaydet

### Her Cuma (10 dakika)
1. Gelecek haftaya bak
2. Yaklaşan süreleri kontrol et
3. Hazırlık görevleri ekle
4. Müvekkillere bilgi ver

---

## SENKRONIZASYON (Mac + iPhone)

### Web-Based Sistem
- Sistem web üzerinde çalışır
- **Her cihazdan aynı URL'i aç**
- Veritabanı MongoDB'de (bulutta)
- Değişiklikler anında yansır

### iPhone'da Kullanım
1. Safari'de siteyi aç
2. Paylaş butonu (📤)
3. "Ana Ekrana Ekle"
4. İkon oluşur → Uygulama gibi çalışır!

### Mac'te Kullanım
- Safari/Chrome'da bookmark yap
- Veya PWA olarak yükle

### Vercel'e Deploy Edince (İLERİDE)
- Tek URL: `https://avukat-sistem.vercel.app`
- Her yerden eriş
- iPhone, Mac, iPad hepsi sync

---

## SORUN GİDERME

### "MongoDB bağlanamıyor" Hatası
**Çözüm:**
1. .env dosyasındaki connection string'i kontrol et
2. MongoDB Atlas'ta IP access kontrolü yap
3. Şifrede özel karakter varsa URL encode et
4. Cluster'ın aktif olduğunu kontrol et

### "Cannot GET /" Hatası
**Çözüm:**
1. Backend çalışıyor mu kontrol et
2. Frontend .env'de backend URL doğru mu?
3. CORS hatası varsa backend'de FRONTEND_URL kontrol et

### Sayfa Yüklenmiyor
**Çözüm:**
1. Her iki terminal de çalışıyor mu?
2. Port çakışması var mı? (3000, 3001)
3. Tarayıcı cache'i temizle (Cmd/Ctrl + Shift + R)

### Değişiklikler Yansımıyor
**Çözüm:**
1. Sayfayı yenile (F5)
2. Backend loglarına bak (hatalar var mı?)
3. MongoDB'de veriler var mı kontrol et

---

## GELİŞMİŞ KULLANIM

### 1. Vercel'e Deploy (Ücretsiz Online Hosting)
- README.md'deki "ADIM 4" bölümünü takip et
- Artık her yerden eriş
- iPhone'dan, Mac'ten, iPad'den

### 2. Yedekleme
- MongoDB Atlas otomatik yedekler
- İsteğe bağlı manuel export:
  1. MongoDB Atlas → Database → Collections
  2. "Export Collection" → JSON

### 3. Raporlama (Gelecek Özellik)
- Aylık rapor
- En çok işlem yapılan dosyalar
- Görev tamamlama oranı

---

## DESTEK

### Hata Raporla
1. Konsolu aç (F12)
2. Hata mesajını kopyala
3. Backend terminal loglarını kontrol et
4. Screenshot al

### Özellik İste
- Hangi özelliği istiyorsun?
- Nasıl çalışmasını istiyorsun?
- Örnek senaryo ver

---

## KISA YOLLAR

```bash
# Sistemi başlat (her seferinde)
Terminal 1: cd backend && npm start
Terminal 2: cd frontend && npm run dev

# Tarayıcı: http://localhost:3000
```

---

**Kolay gelsin Halil! ⚖️**

Sorular için: Her zaman burdayım!
