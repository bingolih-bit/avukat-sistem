# 📱 AVUKAT ASİSTAN - Kurulum Rehberi

## 🎯 Sistem Özellikleri

### ✅ Tamamlanan Özellikler

1. **PWA (Progressive Web App) Desteği**
   - iPhone ve MacBook'ta ana ekrana eklenebilir
   - Uygulama gibi çalışır
   - Offline destek
   - Hızlı yükleme

2. **Akıllı Bildirim Sistemi**
   - iOS ve MacOS push bildirimleri
   - Her sabah 08:00'de günlük özet
   - Acil sürelerden önce otomatik hatırlatma
   - Duruşmadan 1 saat ve 15 dakika önce bildirim
   - 7/24 çalışan hatırlatma motoru

3. **Süre Takip Sistemi**
   - Duruşma, istinaf, temyiz süreleri
   - Türk resmi tatil günleri entegrasyonu
   - İş günü bazında otomatik hesaplama
   - Aciliyet seviyesi (acil/yakın/güvenli)

4. **Dosya Yönetim Sistemi**
   - Müvekkil bilgileri
   - Mahkeme bilgileri
   - Dosya detayları (dosya no, tür, durum)
   - Karşı taraf bilgileri

5. **Duruşma Hazırlık Checklist**
   - Duruşma öncesi yapılacaklar listesi
   - İlerleme takibi
   - Tamamlanma yüzdesi

6. **Dilekçe Şablonları**
   - Hazır dilekçe şablonları
   - Değişken placeholder sistemi
   - Kategori bazlı organizasyon

7. **Hızlı Notlar**
   - Duruşma notları
   - Görüşme notları
   - Araştırma notları
   - Etiket sistemi
   - Dosya/müvekkil ilişkilendirme

8. **Finansal Takip**
   - Masraf yönetimi
   - Vekalet ücreti takibi
   - Tahsilat durumu
   - Kategori bazlı masraf takibi

---

## 🚀 Hızlı Kurulum

### 1. Gereksinimler

- Node.js (v18 veya üzeri)
- MongoDB Atlas hesabı (ücretsiz)
- Git

### 2. Proje Kurulumu

```bash
# Depoyu klonlayın
git clone <repo-url>
cd avukat-sistem

# Backend kurulumu
cd backend
npm install
cp .env.example .env

# Frontend kurulumu
cd ../frontend
npm install
```

### 3. MongoDB Atlas Kurulumu (Ücretsiz)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) adresinden ücretsiz hesap oluşturun
2. Yeni bir Cluster oluşturun (M0 FREE tier)
3. Database Access'den kullanıcı oluşturun
4. Network Access'den IP adresinizi ekleyin (veya 0.0.0.0/0 tüm IP'ler)
5. "Connect" butonuna tıklayın
6. "Connect your application" seçeneğini seçin
7. Connection string'i kopyalayın

### 4. VAPID Keys Oluşturma

```bash
cd backend
node scripts/generate-vapid-keys.js
```

Çıktı örneği:
```
VAPID_PUBLIC_KEY=BAfiCFDEWHtSYVcUlxo0IB_8Ru5oDMMw32wHqnKLNiuFDb8bTs2-j2D6HA2cmW9S4RzTvsMERSmYIqlGR6Tvq0w
VAPID_PRIVATE_KEY=yOygvfb-pAWIk6tYcsWTGsT_lOZlcaA6f48QiifZCoI
```

### 5. Çevre Değişkenlerini Ayarlama

#### Backend `.env` dosyası:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/avukat-sistem?retryWrites=true&w=majority
PORT=3001
FRONTEND_URL=http://localhost:3000

# VAPID keys (yukarıdaki komuttan alın)
VAPID_PUBLIC_KEY=BAfiCFDEWHtSYVcUlxo0IB_8Ru5oDMMw32wHqnKLNiuFDb8bTs2-j2D6HA2cmW9S4RzTvsMERSmYIqlGR6Tvq0w
VAPID_PRIVATE_KEY=yOygvfb-pAWIk6tYcsWTGsT_lOZlcaA6f48QiifZCoI
```

#### Frontend `.env.local` dosyası:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BAfiCFDEWHtSYVcUlxo0IB_8Ru5oDMMw32wHqnKLNiuFDb8bTs2-j2D6HA2cmW9S4RzTvsMERSmYIqlGR6Tvq0w
```

### 6. Uygulamayı Başlatma

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Tarayıcıda açın: `http://localhost:3000`

---

## 📱 iPhone Kurulumu

### iOS'ta Ana Ekrana Ekleme

1. Safari'de `http://localhost:3000` adresini açın
   - **ÖNEMLİ:** Safari kullanmalısınız, Chrome/Firefox desteklemez

2. Alttaki "Paylaş" butonuna basın (📤)

3. "Ana Ekrana Ekle" seçeneğini bulun ve basın

4. "Ekle" butonuna basın

5. Ana ekrandaki "Avukat Asistan" simgesine basarak açın

### Bildirim İzinleri

1. Uygulamayı ilk açtığınızda bildirim izni isteği gelecek
2. "İzin Ver" seçeneğini seçin
3. Bildirimleri test etmek için ana ekranda "Bildirim Yönetimi" bölümünden "Test" butonuna basın

---

## 💻 MacBook Kullanımı

### 1. Tarayıcıda Kullanım

- Chrome, Safari veya Edge kullanabilirsiniz
- `http://localhost:3000` adresini açın

### 2. Masaüstü Uygulaması Gibi Kullanma

#### Chrome'da:
1. Sağ üst köşede "Yükle" (+) ikonuna tıklayın
2. "Yükle" butonuna basın
3. Dock'ta veya Applications'da görünecek

#### Safari'de:
1. Şu an Safari masaüstü PWA'yı desteklemiyor
2. Chrome veya Edge kullanın

---

## 🔔 Bildirim Sistemi Nasıl Çalışır?

### Otomatik Hatırlatmalar:

1. **Günlük Özet (Her sabah 08:00)**
   - Bugünkü duruşmalar
   - Acil süreler
   - Haftalık özet

2. **Süre Hatırlatmaları**
   - 3 gün kala: "⏰ 3 Gün Kaldı"
   - 2 gün kala: "⚠️ 2 Gün Kaldı"
   - 1 gün kala: "⚠️ 1 Gün Kaldı!"
   - Son gün: "🔴 SON GÜN!"

3. **Duruşma Hatırlatmaları**
   - 1 saat önce: "⚖️ Duruşma 1 Saat Sonra!"
   - 15 dakika önce: "🚨 Duruşma 15 Dakika Sonra!"

### Bildirimler Gelmiyor mu?

**iPhone:**
- Ayarlar > Safari > Gelişmiş > Deneysel Özellikler > "Notifications" açık olmalı
- Uygulama home screen'den açılmalı
- Bildirim izni verilmiş olmalı

**MacBook:**
- Tarayıcı bildirim izni verilmiş olmalı
- Sistem Tercihleri > Bildirimler > Chrome/Edge açık olmalı

---

## 🌐 Ücretsiz Cloud Hosting (Opsiyonel)

Terminal açık tutmadan 7/24 çalışması için:

### Backend - Railway (Ücretsiz 500 saat/ay)

1. [Railway](https://railway.app) hesabı oluşturun
2. "New Project" > "Deploy from GitHub"
3. Backend klasörünü seçin
4. Environment variables ekleyin (.env içerikleri)
5. Deploy edin

### Frontend - Vercel (Ücretsiz)

1. [Vercel](https://vercel.com) hesabı oluşturun
2. "Import Project" > GitHub'dan frontend'i seçin
3. Environment variables ekleyin
4. Deploy edin

**Not:** Cloud deployment sonrası CORS ayarlarını güncellemeyi unutmayın!

---

## 📊 Kullanım Senaryoları

### Senaryo 1: Yeni Duruşma Ekleme

1. Ana ekranda "Yeni Süre Ekle" butonuna basın
2. Tür: "Duruşma" seçin
3. Tebligat tarihini girin
4. Duruşma tarih ve saatini girin
5. Dosya numarasını ve mahkemeyi girin
6. "Kaydet" butonuna basın

→ Sistem otomatik olarak:
- Duruşmadan 1 saat önce hatırlatma ayarlar
- Aciliyet seviyesini belirler
- Kalan günü hesaplar

### Senaryo 2: İstinaf Süresi Ekleme

1. "Yeni Süre Ekle" > Tür: "İstinaf"
2. Tebligat tarihini girin
3. Sistem otomatik olarak 14 iş günü sonrasını hesaplar
4. "Kaydet"

→ Sistem:
- Son günü otomatik hesaplar
- 3 gün kala hatırlatma gönderir
- Her sabah günlük özette gösterir

### Senaryo 3: Checklist Oluşturma

1. Duruşma kaydına gidin
2. "Hazırlık Checklist Oluştur" butonuna basın
3. Checklist öğeleri ekleyin:
   - ✅ Delilleri hazırla
   - ✅ Tanık listesi oluştur
   - ✅ Dilekçeyi yazdır
4. Tamamladıkça işaretleyin

---

## 🆘 Sorun Giderme

### Backend Çalışmıyor

```bash
# MongoDB bağlantısını kontrol edin
cd backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"

# Port 3001 kullanımda mı?
lsof -i :3001
```

### Frontend Build Hatası

```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Bildirimler Çalışmıyor

1. VAPID keys doğru mu? (backend ve frontend aynı public key)
2. Service Worker kayıtlı mı? (Console: `navigator.serviceWorker.controller`)
3. Bildirim izni verilmiş mi? (Console: `Notification.permission`)

---

## 📞 Destek

Sorularınız için:
- GitHub Issues
- Email: [e-posta adresiniz]

---

## 🎉 Tebrikler!

Sisteminiz hazır! Artık:
- ✅ iPhone ve MacBook'ta senkronize çalışıyor
- ✅ Otomatik hatırlatmalar alıyorsunuz
- ✅ Duruşma ve süre takibi yapabiliyorsunuz
- ✅ Offline çalışabiliyor
- ✅ 7/24 bildirim alabiliyorsunuz

**İyi çalışmalar! ⚖️**
