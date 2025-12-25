# 💰 Harcama Gelir Takip Sistemi

Kişisel harcama ve gelir takip uygulaması - iPhone ve MacBook için optimize edilmiş PWA.

## ✨ Özellikler

### 💳 Harcama Yönetimi
- ✅ Hızlı harcama ekleme (tarih, tutar, kategori, açıklama)
- ✅ Kategori seçenekleri: Yemek, Ulaşım, Fatura, Sağlık, Eğlence, Diğer
- ✅ Harcama düzenleme ve silme
- ✅ Arama ve filtreleme

### 💰 Gelir Yönetimi
- ✅ Gelir ekleme (tarih, tutar, kaynak, açıklama)
- ✅ Düzenli gelir tanımlama (maaş gibi)
- ✅ Kategoriler: Dava Ücreti, Baro Nöbet, Danışmanlık, Diğer

### 📅 Sabit Gider Yönetimi
- ✅ Aylık sabit giderler (kira, internet, elektrik vs.)
- ✅ Kesin tutar VEYA aralık (300-700 TL arası gibi)
- ✅ Ayın belirli gününde ödeme hatırlatması
- ✅ Aktif/Pasif yapma

### 📊 Dashboard & Raporlama
- ✅ Aylık özet (toplam gelir, toplam gider, kalan)
- ✅ Gerçek zamanlı istatistikler

### 📱 Mobil Optimizasyon
- ✅ Responsive tasarım (iPhone 11'de mükemmel çalışır)
- ✅ PWA desteği (iPhone'a uygulama gibi eklenebilir)
- ✅ Dark mode
- ✅ Türkçe dil desteği

## 🚀 Kurulum

### 1. Ön Gereksinimler

- **Node.js** 18+ ([İndir](https://nodejs.org/))
- **PostgreSQL** database (Render.com ücretsiz)
- **GitHub** hesabı
- **Vercel** hesabı (ücretsiz)

### 2. Projeyi İndir

```bash
cd expense-app
npm install
```

### 3. PostgreSQL Veritabanı Oluştur (Render.com)

1. [Render.com](https://render.com)'a git ve kayıt ol
2. Dashboard → **New** → **PostgreSQL**
3. **Name**: `expense-tracker-db`
4. **Region**: Frankfurt (Avrupa'ya en yakın)
5. **Plan**: Free (ücretsiz)
6. **Create Database** butonuna tıkla
7. **External Database URL**'yi kopyala (örnek: `postgresql://user:pass@...`)

### 4. Environment Variables Ayarla

`.env.example` dosyasını `.env.local` olarak kopyala:

```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenle:

```env
# PostgreSQL (Render.com'dan aldığın URL)
DATABASE_URL="postgresql://user:password@dpg-xxxxx.frankfurt-postgres.render.com:5432/expense_tracker_db"

# NextAuth Secret (terminalden oluştur: openssl rand -base64 32)
NEXTAUTH_SECRET="buraya-random-secret-key-yazin"
NEXTAUTH_URL="http://localhost:3000"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 5. Veritabanını Hazırla

```bash
# Prisma migration'ları çalıştır
npx prisma migrate dev --name init

# Varsayılan kategorileri ekle
npx prisma db seed
```

### 6. Development Başlat

```bash
npm run dev
```

Tarayıcıda aç: **http://localhost:3000**

✅ **Uygulama çalışıyor!**

---

## ☁️ Production Deploy (Vercel + Render)

### Adım 1: GitHub'a Yükle

```bash
git add .
git commit -m "Harcama takip sistemi hazır"
git push origin claude/expense-income-tracker-UtdOH
```

### Adım 2: Vercel'e Deploy

1. [Vercel](https://vercel.com) hesabına giriş yap
2. **Add New Project**
3. GitHub repo'nu seç: `avukat-sistem`
4. **Root Directory** → `expense-app` seç
5. **Environment Variables** ekle:
   ```
   DATABASE_URL=postgresql://... (Render'dan aldığın URL)
   NEXTAUTH_SECRET=random-secret-key
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```
6. **Deploy** butonuna tıkla

### Adım 3: Production Database Migration

Vercel deploy edildikten sonra, Render PostgreSQL'e migration çalıştır:

1. Vercel Dashboard → Proje → **Settings** → **Functions**
2. Terminal'de:
   ```bash
   # Production database'e bağlan
   DATABASE_URL="production-database-url" npx prisma migrate deploy
   DATABASE_URL="production-database-url" npx prisma db seed
   ```

✅ **Uygulamanız LIVE!** 🎉

---

## 📱 iPhone'a Uygulama Gibi Ekleme

1. **Safari**'de siteyi aç
2. Paylaş butonuna bas (📤)
3. **"Ana Ekrana Ekle"** seç
4. İsim ver: "Harcama Takip"
5. **Ekle** butonuna bas

Artık iPhone'unuzda uygulama gibi çalışıyor! 🚀

---

## 🛠️ Teknolojiler

- **Next.js 14** - React framework
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Styling
- **Prisma** - ORM
- **PostgreSQL** - Veritabanı
- **NextAuth.js** - Authentication
- **PWA** - Progressive Web App

---

## 📊 Veritabanı Şeması

### Users
- id, email, password_hash, created_at

### Expenses
- id, user_id, amount, category, description, receipt_url, date

### Income
- id, user_id, amount, source, description, date, is_recurring

### Fixed Costs
- id, user_id, name, amount_min, amount_max, category, due_day, is_active

### Categories
- id, name, type, icon, color

---

## 🔧 Geliştirme

### Prisma Studio (Database GUI)

```bash
npx prisma studio
```

### Database Schema Değişikliği

```bash
# Schema.prisma dosyasını düzenle
npx prisma migrate dev --name migration-name
```

### Build

```bash
npm run build
npm run start
```

---

## 🎯 Gelecek Özellikler

- [ ] Fiş fotoğrafı yükleme (Cloudinary)
- [ ] CSV/Excel import
- [ ] PDF export (raporlar)
- [ ] Grafik ve çizelgeler (Chart.js)
- [ ] Email hatırlatmaları
- [ ] Push notifications
- [ ] Çoklu para birimi desteği

---

## 🐛 Sorun Giderme

### Database bağlanamıyor
- Render.com'da database'in aktif olduğundan emin olun
- DATABASE_URL doğru mu kontrol edin
- Render free plan 90 gün sonra devre dışı kalabilir

### Vercel deploy hatası
- Environment variables eklenmiş mi?
- Build logs'u kontrol edin
- Node.js versiyonu 18+ olmalı

### PWA çalışmıyor
- HTTPS kullanıyor musunuz? (Vercel otomatik sağlar)
- manifest.json erişilebilir mi?
- Service Worker kayıtlı mı?

---

## 📞 Destek

Herhangi bir sorun için:
1. Vercel deployment logs'una bakın
2. Render database logs'una bakın
3. Browser console'u kontrol edin

---

## 📝 Lisans

MIT License - Kişisel kullanım için ücretsiz

---

**İyi kullanımlar! 💰**
