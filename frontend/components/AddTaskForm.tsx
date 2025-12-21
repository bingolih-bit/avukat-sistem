'use client'

import { useState } from 'react'
import { useTaskStore } from '@/store/taskStore'

interface AddTaskFormProps {
  onClose: () => void
}

export default function AddTaskForm({ onClose }: AddTaskFormProps) {
  const { addTask, loading } = useTaskStore()
  
  const [formData, setFormData] = useState({
    baslik: '',
    aciklama: '',
    dosyaNo: '',
    oncelik: 'orta',
    tarih: '',
    saat: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.baslik) {
      alert('Lütfen görev başlığı girin!')
      return
    }

    await addTask({
      baslik: formData.baslik,
      aciklama: formData.aciklama,
      dosyaNo: formData.dosyaNo,
      oncelik: formData.oncelik as any,
      tarih: formData.tarih,
      saat: formData.saat,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Yeni Görev Ekle</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Görev Başlığı *</label>
            <input
              type="text"
              value={formData.baslik}
              onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Örn: Tanık listesi hazırla"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Açıklama</label>
            <textarea
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Ek detaylar..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Öncelik</label>
            <select
              value={formData.oncelik}
              onChange={(e) => setFormData({ ...formData, oncelik: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="yuksek">Yüksek Öncelik</option>
              <option value="orta">Orta Öncelik</option>
              <option value="dusuk">Düşük Öncelik</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Tarih</label>
              <input
                type="date"
                value={formData.tarih}
                onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Saat</label>
              <input
                type="time"
                value={formData.saat}
                onChange={(e) => setFormData({ ...formData, saat: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

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

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary disabled:opacity-50"
            >
              {loading ? 'Ekleniyor...' : 'Görev Ekle'}
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
