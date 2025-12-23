# 🚀 TEK TIKLAMA DEPLOYMENT

## Backend'i Tek Tıkla Deploy Et!

**👉 Bu butona tıkla:**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/bingolih-bit/avukat-sistem)

---

**Bu buton:**
1. Otomatik repository bağlar
2. Backend ayarlarını yapar
3. Sadece environment variables girmen gerekir

---

## Environment Variables (Copy-Paste Yap)

Render sayfası açıldığında, her bir değişken için aşağıdaki değerleri **copy-paste** yap:

### MONGODB_URI
```
mongodb+srv://avukat:1TKbTSB4TQsA1fsc@avukat.qsnlqeq.mongodb.net/avukat-sistem?retryWrites=true&w=majority
```

### PORT
```
3001
```

### FRONTEND_URL
```
https://avukat-asistan.vercel.app
```

### VAPID_PUBLIC_KEY
```
BFubVgwAUyt8FMbDWaABMvmGShRqRfuvCQznOJQBKisBDyyPruSHQ_oMqoG3VIyA3TCn9QOqxSNLjdROES8dAlo
```

### VAPID_PRIVATE_KEY
```
vSQvZBC31s30NCfNsgqN_94gvF-Yd7gHjxzqCGtOvxI
```

---

## Frontend'i Tek Tıkla Deploy Et!

**👉 Bu butona tıkla:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bingolih-bit/avukat-sistem&root-directory=frontend&env=NEXT_PUBLIC_API_URL,NEXT_PUBLIC_VAPID_PUBLIC_KEY)

---

**Environment Variables (Vercel):**

### NEXT_PUBLIC_API_URL
```
https://avukat-sistem-backend.onrender.com
```
*(Render'dan aldığın URL'i buraya yapıştır)*

### NEXT_PUBLIC_VAPID_PUBLIC_KEY
```
BFubVgwAUyt8FMbDWaABMvmGShRqRfuvCQznOJQBKisBDyyPruSHQ_oMqoG3VIyA3TCn9QOqxSNLjdROES8dAlo
```

---

## VEYA: Manuel Deployment (Daha Kolay)

Eğer butonlar çalışmazsa, şu linklere git:

### Backend (Render):
1. Git: https://dashboard.render.com/
2. Sign up with GitHub
3. New → Web Service
4. Connect Repository: `avukat-sistem`
5. **Root Directory kısmına:** `backend` yaz
6. Scroll down → **Add Environment Variable** butonu görünecek
7. Her bir değişkeni ekle (yukarıdaki değerleri copy-paste)

### Frontend (Vercel):
1. Git: https://vercel.com/new
2. Import `avukat-sistem`
3. **Root Directory dropdown:** `frontend` seç
4. Environment Variables ekle (yukarıdaki değerleri copy-paste)

---

## 🎯 ÖZET

1. ✅ Render butonuna tıkla → Environment variables copy-paste → Deploy
2. ✅ Vercel butonuna tıkla → Environment variables copy-paste → Deploy
3. ✅ Render'da FRONTEND_URL'i Vercel URL'nle güncelle
4. ✅ iPhone'a ekle

**5 dakika!** ⚡
