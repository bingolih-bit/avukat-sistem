import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanı seed başlıyor...')

  // Harcama Kategorileri
  const expenseCategories = [
    { name: 'Yemek', type: 'expense', icon: '🍽️', color: '#ef4444', isDefault: true },
    { name: 'Ulaşım', type: 'expense', icon: '🚗', color: '#3b82f6', isDefault: true },
    { name: 'Fatura', type: 'expense', icon: '📄', color: '#f59e0b', isDefault: true },
    { name: 'Sağlık', type: 'expense', icon: '🏥', color: '#10b981', isDefault: true },
    { name: 'Eğlence', type: 'expense', icon: '🎉', color: '#8b5cf6', isDefault: true },
    { name: 'Alışveriş', type: 'expense', icon: '🛒', color: '#ec4899', isDefault: true },
    { name: 'Eğitim', type: 'expense', icon: '📚', color: '#6366f1', isDefault: true },
    { name: 'Diğer', type: 'expense', icon: '📦', color: '#6b7280', isDefault: true },
  ]

  // Gelir Kategorileri
  const incomeCategories = [
    { name: 'Dava Ücreti', type: 'income', icon: '⚖️', color: '#10b981', isDefault: true },
    { name: 'Baro Nöbet', type: 'income', icon: '📋', color: '#3b82f6', isDefault: true },
    { name: 'Danışmanlık', type: 'income', icon: '💼', color: '#8b5cf6', isDefault: true },
    { name: 'Diğer', type: 'income', icon: '💰', color: '#6b7280', isDefault: true },
  ]

  // Kategorileri ekle
  for (const category of [...expenseCategories, ...incomeCategories]) {
    await prisma.category.upsert({
      where: {
        name_type: {
          name: category.name,
          type: category.type,
        },
      },
      update: {},
      create: category,
    })
  }

  console.log('✅ Seed tamamlandı!')
  console.log(`📊 ${expenseCategories.length} harcama kategorisi eklendi`)
  console.log(`💰 ${incomeCategories.length} gelir kategorisi eklendi`)
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
