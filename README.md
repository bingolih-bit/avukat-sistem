# ⚖️ Avukat Süre Takip & Yönetim Sistemi

Türk hukuku için özel olarak tasarlanmış, süre takibi ve günlük görev yönetimi sistemi.

## 🎯 ÖZELLİKLER

### Süre Takip Sistemi
- ✅ Duruşma, İstinaf, Temyiz süreleri
- ✅ **Türk hukuku süre hesaplayıcı** (resmi tatil + hafta sonu kontrolü)
- ✅ Otomatik aciliyet belirleme (🔴 Acil, 🟡 Yakın, 🟢 Güvenli)
- ✅ Kalan gün sayacı
- ✅ Dosya ve mahkeme bilgileri

### Görev Yönetimi
- ✅ Yapılacaklar listesi
- ✅ Checkbox ile tamamlama
- ✅ Öncelik seviyeleri (Yüksek, Orta, Düşük)
- ✅ Tarih ve saat belirleme
- ✅ Dosya bazlı gruplama

### Genel
- ✅ **Mac + iPhone sync** (web-based, iCloud gibi)
- ✅ Temiz, basit arayüz
- ✅ Dashboard istatistikleri
- ✅ Gerçek zamanlı güncelleme

---

## 🚀 KURULUM

### ÖN GEREKSİNİMLER

1. **Node.js** (v18 veya üzeri)
   - İndir: https://nodejs.org/

2. **MongoDB Atlas Hesabı** (ÜCRETSİZ)
   - Kayıt ol: https://www.mongodb.com/cloud/atlas/register
   - 512MB ücretsiz database

---

## 📦 ADIM 1: MONGODB ATLAS KURULUMU

### 1. MongoDB Atlas'a kayıt ol
- https://www.mongodb.com/cloud/atlas/register
- Free tier seç (M0 Sandbox - 512MB)

### 2. Cluster oluştur
- "Build a Database" butonuna tıkla
- FREE seçeneğini seç
- Provider: AWS
- Region: En yakın (Frankfurt/Paris)
- Cluster Name: avukat-sistem

### 3. Database kullanıcısı oluştur
- Security → Database Access
- "Add New Database User"
- Username: `avukat_admin`
- Password: Güçlü bir şifre oluştur (kaydet!)
- Role: "Atlas admin"

### 4. Network Access ayarla
- Security → Network Access
- "Add IP Address"
- "Allow Access from Anywhere" seç (0.0.0.0/0)
- Confirm

### 5. Connection String al
- Database → Connect
- "Connect your application" seç
- Driver: Node.js
- Version: 5.5 or later
- Connection string'i kopyala:
  ```
  mongodb+srv://avukat_admin:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
  ```

---

## 💻 ADIM 2: BACKEND KURULUMU

### 1. Backend klasörüne git
```bash
cd backend
```

### 2. Paketleri yükle
```bash
npm install
```

### 3. .env dosyası oluştur
```bash
cp .env.example .env
```

### 4. .env dosyasını düzenle
```env
MONGODB_URI=mongodb+srv://avukat_admin:SIFREN@cluster.mongodb.net/avukat-sistem?retryWrites=true&w=majority
PORT=3001
FRONTEND_URL=http://localhost:3000
```

**ÖNEMLİ:** `<password>` yerine MongoDB Atlas'ta oluşturduğun şifreyi yaz!

### 5. Backend'i başlat
```bash
npm start
```

✅ Şunu görmelisin:
```
✅ MongoDB bağlantısı başarılı
🚀 Server 3001 portunda çalışıyor
```

---

## 🎨 ADIM 3: FRONTEND KURULUMU

### 1. Yeni terminal aç, frontend klasörüne git
```bash
cd frontend
```

### 2. Paketleri yükle
```bash
npm install
```

### 3. Development server'ı başlat
```bash
npm run dev
```

### 4. Tarayıcıda aç
- http://localhost:3000

✅ **SİSTEM ÇALIŞIYOR!** 🎉

---

## ☁️ ADIM 4: VERCEL'E DEPLOY (ÜCRETSİZ)

### Frontend Deployment

1. **Vercel hesabı oluştur**
   - https://vercel.com/signup
   - GitHub ile giriş yap

2. **GitHub'a yükle**
   ```bash
   # Proje klasöründe
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create avukat-sistem --public --source=. --remote=origin
   git push -u origin main
   ```

3. **Vercel'e deploy**
   - Vercel Dashboard'a git
   - "Add New Project"
   - GitHub repo'yu seç: avukat-sistem
   - Root Directory: `frontend`
   - "Deploy" butonuna bas

4. **Environment Variables ekle**
   - Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = Backend URL'in (Railway'den alacağın)

### Backend Deployment (Railway - ÜCRETSİZ)

1. **Railway hesabı oluştur**
   - https://railway.app/
   - GitHub ile giriş yap

2. **Yeni proje oluştur**
   - "New Project"
   - "Deploy from GitHub repo"
   - Repo seç: avukat-sistem
   - Root Directory: `backend`

3. **Environment Variables ekle**
   ```
   MONGODB_URI=mongodb+srv://...  (MongoDB Atlas'tan)
   PORT=3001
   FRONTEND_URL=https://avukat-sistem.vercel.app  (Vercel URL'in)
   ```

4. **Deploy**
   - Otomatik deploy olur
   - Railway sana bir URL verecek: `https://avukat-sistem-production.up.railway.app`

5. **Frontend'i güncelle**
   - Vercel → Settings → Environment Variables
   - `NEXT_PUBLIC_API_URL` = Railway URL'in
   - Redeploy

✅ **SİSTEM ONLINE!** Her yerden erişebilirsin! 🌍

---

## 📱 KULLANIM

### iPhone'dan Uygulama Gibi Kullan

1. Safari'de siteyi aç
2. Paylaş (📤) → "Ana Ekrana Ekle"
3. Artık uygulama gibi çalışıyor!

### Mac'ten

- Tarayıcıdan aç
- Bookmark yap
- Veya PWA olarak yükle

---

## 🔧 YENİ ÖZELLİK EKLEMEFrontal

### 1. OCR (Fotoğraftan Tebligat Okuma)

```bash
# Frontend'e tesseract.js ekle
npm install tesseract.js

# Yeni component: OCRUpload.tsx
# Fotoğraf çek → OCR → tarihleri parse et → form doldur
```

### 2. UYAP Entegrasyonu

```bash
# UDF dosyası upload
# Parse et (XML/PDF)
# Duruşma tarihlerini otomatik çıkar
```

### 3. Push Notification

```bash
# Web Push API
# Service Worker
# Her sabah 09:00'da günlük özet
# Acil sürelerden 1 gün önce hatırlatma
```

---

## 🛠️ SORUN GİDERME

### MongoDB bağlanamıyor
- Network Access'te IP adresini kontrol et
- Connection string'deki şifreyi kontrol et
- Cluster'ın aktif olduğundan emin ol

### Frontend backend'e bağlanamıyor
- .env dosyasındaki URL'leri kontrol et
- CORS ayarlarını kontrol et
- Backend'in çalıştığından emin ol

### Vercel deploy hatası
- Build logs'u kontrol et
- Environment variables'ı kontrol et
- Node.js versiyonunu kontrol et

---

## 📊 VERİTABANI YAPILANDIRMASI

### Collections

**deadlines** (sureler)
```javascript
{
  baslik: String,
  tur: String,  // durusma, istinaf, temyiz...
  tebligatTarihi: Date,
  sonGun: Date,
  dosyaNo: String,
  mahkeme: String,
  notlar: String,
  aciliyet: String,  // acil, yakin, guvenli
  kalanGun: Number
}
```

**tasks** (gorevler)
```javascript
{
  baslik: String,
  aciklama: String,
  dosyaNo: String,
  oncelik: String,  // yuksek, orta, dusuk
  tarih: String,
  saat: String,
  tamamlandi: Boolean
}
```

---

## 🔐 GÜVENLİK

- MongoDB Atlas kullanıcı şifresi güçlü olsun
- .env dosyasını asla GitHub'a yükleme
- Production'da HTTPS kullan (Vercel otomatik sağlıyor)

---

## 📞 DESTEK

Herhangi bir sorun yaşarsan:
1. MongoDB Atlas logs'una bak
2. Vercel deployment logs'una bak
3. Railway logs'una bak
4. Browser console'u kontrol et

---

## 🎉 TAMAMLANDI!

Artık profesyonel bir süre takip sistemin var:
- ✅ Mac + iPhone sync
- ✅ Türk hukuku süre hesaplayıcı
- ✅ Görev yönetimi
- ✅ Ücretsiz hosting
- ✅ 7/24 çalışan

**İyi çalışmalar! ⚖️**
