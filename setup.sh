#!/bin/bash

echo "🚀 Avukat Sistem - Hızlı Kurulum"
echo "=================================="
echo ""

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Node.js kontrolü
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js bulunamadı!${NC}"
    echo "Lütfen Node.js'i yükleyin: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✅ Node.js bulundu: $(node -v)${NC}"
echo ""

# Backend kurulum
echo "📦 Backend kurulumu başlıyor..."
cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env dosyası bulunamadı!${NC}"
    echo "Lütfen .env.example dosyasını kopyalayıp düzenleyin:"
    echo "  cp .env.example .env"
    echo "  nano .env  # veya herhangi bir editör"
    echo ""
    echo "MongoDB Atlas bağlantı bilgilerinizi girin."
    exit 1
fi

echo "📥 Backend paketleri yükleniyor..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backend paket yüklemesi başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend kurulumu tamamlandı${NC}"
echo ""

# Frontend kurulum
echo "📦 Frontend kurulumu başlıyor..."
cd ../frontend

echo "📥 Frontend paketleri yükleniyor..."
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Frontend paket yüklemesi başarısız!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Frontend kurulumu tamamlandı${NC}"
echo ""

# Başlatma talimatları
echo ""
echo "=================================="
echo -e "${GREEN}🎉 Kurulum tamamlandı!${NC}"
echo "=================================="
echo ""
echo "Sistemi başlatmak için:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend"
echo "    npm start"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "Tarayıcıda aç: http://localhost:3000"
echo ""
echo -e "${YELLOW}Not: Backend'in MongoDB'ye bağlanabilmesi için .env dosyasını düzenlemeyi unutmayın!${NC}"
