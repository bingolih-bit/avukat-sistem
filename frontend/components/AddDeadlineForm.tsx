'use client'

import { useState, useEffect } from 'react'
import { useDeadlineStore } from '@/store/deadlineStore'
import { otomatikSureHesapla } from '@/lib/dateUtils'
import { format } from 'date-fns'

interface AddDeadlineFormProps {
  onClose: () => void
}

export default function AddDeadlineForm({ onClose }: AddDeadlineFormProps) {
  const { addDeadline, loading } = useDeadlineStore()
  
  const [formData, setFormData] = useState({
    baslik: '',
    tur: 'durusma',
    tebligatTarihi: '',
    sonGun: '',
    dosyaNo: '',
    mahkeme: '',
    notlar: '',
  })

  // Tebligat tarihi değiştiğinde otomatik süre hesapla
  useEffect(() => {
    if (formData.tebligatTarihi && (formData.tur === 'istinaf' || formData.tur === 'temyiz' || formData.tur === 'cevap_layihasi')) {
      const tebligatDate = new Date(formData.tebligatTarihi)
      const calculatedDate = otomatikSureHesapla(formData.tur, tebligatDate)
      setFormData(prev => ({
        ...prev,
        sonGun: format(calculatedDate, "yyyy-MM-dd'T'HH:mm")
      }))
    }
  }, [formData.tebligatTarihi, formData.tur])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.baslik || !formData.sonGun) {
      alert('Lütfen zorunlu alanları doldurun!')
      return
    }

    await addDeadline({
      baslik: formData.baslik,
      tur: formData.tur as any,
      tebligatTarihi: formData.tebligatTarihi || new Date().toISOString(),
      sonGun: formData.sonGun,
      dosyaNo: formData.dosyaNo,
      mahkeme: formData.mahkeme,
      notlar: formData.notlar,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Yeni Süre Ekle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Başlık *</label>
            <input
              type="text"
              value={formData.baslik}
              onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Örn: Ahmet Yılmaz - Duruşma"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Süre Türü *</label>
            <select
              value={formData.tur}
              onChange={(e) => setFormData({ ...formData, tur: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="durusma">Duruşma</option>
              <option value="istinaf">İstinaf Süresi</option>
              <option value="temyiz">Temyiz Süresi</option>
              <option value="cevap_layihasi">Cevap Layihası</option>
              <option value="tebligat">Tebligat Bekleme</option>
              <option value="kesif">Keşif</option>
              <option value="bilirkisi">Bilirkişi Raporu</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Dosya No</label>
              <input
                type="text"
                value={formData.dosyaNo}
                onChange={(e) => setFormData({ ...formData, dosyaNo: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="2024/123"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Mahkeme</label>
              <input
                type="text"
                value={formData.mahkeme}
                onChange={(e) => setFormData({ ...formData, mahkeme: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ankara 5. Asliye Ceza"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Tebligat Tarihi</label>
            <input
              type="date"
              value={formData.tebligatTarihi}
              onChange={(e) => setFormData({ ...formData, tebligatTarihi: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500 mt-1">
              İstinaf/Temyiz için otomatik süre hesaplanır
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Son Gün/Saat *</label>
            <input
              type="datetime-local"
              value={formData.sonGun}
              onChange={(e) => setFormData({ ...formData, sonGun: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Notlar</label>
            <textarea
              value={formData.notlar}
              onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Ek bilgiler..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Ekleniyor...' : 'Süre Ekle'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
