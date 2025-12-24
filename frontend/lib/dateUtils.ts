import { addDays, addWeeks, addMonths, isWeekend, differenceInDays, parseISO } from 'date-fns'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

// Türkiye resmi tatilleri 2024-2025
const RESMI_TATILLER_2024_2025 = [
  '2024-01-01', // Yılbaşı
  '2024-04-10', '2024-04-11', '2024-04-12', // Ramazan Bayramı
  '2024-04-23', // Ulusal Egemenlik ve Çocuk Bayramı
  '2024-05-01', // İşçi Bayramı
  '2024-05-19', // Gençlik ve Spor Bayramı
  '2024-06-16', '2024-06-17', '2024-06-18', // Kurban Bayramı
  '2024-08-30', // Zafer Bayramı
  '2024-10-29', // Cumhuriyet Bayramı
  '2025-01-01', // Yılbaşı
  '2025-03-30', '2025-03-31', '2025-04-01', // Ramazan Bayramı (tahmini)
  '2025-04-23', // Ulusal Egemenlik ve Çocuk Bayramı
  '2025-05-01', // İşçi Bayramı
  '2025-05-19', // Gençlik ve Spor Bayramı
  '2025-06-06', '2025-06-07', '2025-06-08', // Kurban Bayramı (tahmini)
  '2025-08-30', // Zafer Bayramı
  '2025-10-29', // Cumhuriyet Bayramı
]

export function isResmiTatil(date: Date): boolean {
  const dateStr = format(date, 'yyyy-MM-dd')
  return RESMI_TATILLER_2024_2025.includes(dateStr)
}

export function isIsMuamelesizGun(date: Date): boolean {
  return isWeekend(date) || isResmiTatil(date)
}

// Son günü hesapla (iş günü bazlı)
export function hesaplaSonGun(baslangicTarihi: Date, gunSayisi: number): Date {
  let sonGun = new Date(baslangicTarihi)
  let kalanGun = gunSayisi

  while (kalanGun > 0) {
    sonGun = addDays(sonGun, 1)
    if (!isIsMuamelesizGun(sonGun)) {
      kalanGun--
    }
  }

  return sonGun
}

// Türk hukuku süre hesaplamaları
export function hesaplaIstinafSuresi(tebligatTarihi: Date): Date {
  // İstinaf: 2 hafta (14 gün - iş günü)
  return hesaplaSonGun(tebligatTarihi, 14)
}

export function hesaplaTemyizSuresi(tebligatTarihi: Date): Date {
  // Temyiz: 1 ay (30 gün - iş günü)
  return hesaplaSonGun(tebligatTarihi, 30)
}

export function hesaplaCevapSuresi(tebligatTarihi: Date): Date {
  // Cevap layihası: 2 hafta (14 gün - iş günü)
  return hesaplaSonGun(tebligatTarihi, 14)
}

// Kalan gün hesapla
export function hesaplaKalanGun(sonGun: string | Date): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const targetDate = typeof sonGun === 'string' ? parseISO(sonGun) : sonGun
  targetDate.setHours(0, 0, 0, 0)
  
  return differenceInDays(targetDate, today)
}

// Aciliyet seviyesi belirle
export function hesaplaAciliyet(kalanGun: number): 'acil' | 'yakin' | 'guvenli' {
  if (kalanGun <= 3) return 'acil'
  if (kalanGun <= 7) return 'yakin'
  return 'guvenli'
}

// Tarih formatla (Türkçe)
export function formatTarih(date: string | Date, formatStr: string = 'dd MMMM yyyy'): string {
  const targetDate = typeof date === 'string' ? parseISO(date) : date
  return format(targetDate, formatStr, { locale: tr })
}

// Süre türüne göre otomatik hesaplama
export function otomatikSureHesapla(
  tur: string,
  tebligatTarihi: Date
): Date {
  switch (tur) {
    case 'istinaf':
      return hesaplaIstinafSuresi(tebligatTarihi)
    case 'temyiz':
      return hesaplaTemyizSuresi(tebligatTarihi)
    case 'cevap_layihasi':
      return hesaplaCevapSuresi(tebligatTarihi)
    default:
      return tebligatTarihi
  }
}
