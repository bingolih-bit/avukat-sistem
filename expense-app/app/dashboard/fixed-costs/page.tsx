'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Calendar as CalendarIcon } from 'lucide-react'
import { toast } from 'sonner'

interface FixedCost {
  id: string
  name: string
  amountMin: string
  amountMax: string | null
  category: string
  dueDay: number
  isActive: boolean
}

export default function FixedCostsPage() {
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    amountMin: '',
    amountMax: '',
    category: 'Fatura',
    dueDay: '1',
  })

  useEffect(() => {
    fetchFixedCosts()
  }, [])

  const fetchFixedCosts = async () => {
    try {
      const res = await fetch('/api/fixed-costs')
      const data = await res.json()
      setFixedCosts(data)
    } catch (error) {
      toast.error('Sabit giderler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/fixed-costs/${editingId}` : '/api/fixed-costs'
      const method = editingId ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        amountMax: formData.amountMax || null,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()

      toast.success(editingId ? 'Sabit gider güncellendi' : 'Sabit gider eklendi')
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: '',
        amountMin: '',
        amountMax: '',
        category: 'Fatura',
        dueDay: '1',
      })
      fetchFixedCosts()
    } catch (error) {
      toast.error('İşlem başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu sabit gideri silmek istediğinize emin misiniz?')) return

    try {
      await fetch(`/api/fixed-costs/${id}`, { method: 'DELETE' })
      toast.success('Sabit gider silindi')
      fetchFixedCosts()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const handleEdit = (item: FixedCost) => {
    setEditingId(item.id)
    setFormData({
      name: item.name,
      amountMin: item.amountMin,
      amountMax: item.amountMax || '',
      category: item.category,
      dueDay: item.dueDay.toString(),
    })
    setShowForm(true)
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/fixed-costs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      fetchFixedCosts()
      toast.success(isActive ? 'Devre dışı bırakıldı' : 'Etkinleştirildi')
    } catch (error) {
      toast.error('İşlem başarısız')
    }
  }

  const activeCosts = fixedCosts.filter((fc) => fc.isActive)
  const inactiveCosts = fixedCosts.filter((fc) => !fc.isActive)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sabit Giderler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {activeCosts.length} aktif sabit gider
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              name: '',
              amountMin: '',
              amountMax: '',
              category: 'Fatura',
              dueDay: '1',
            })
          }}
          className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Yeni Sabit Gider
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Sabit Gider Düzenle' : 'Yeni Sabit Gider Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gider Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Örn: Kira, Elektrik"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  required
                >
                  <option value="Fatura">Fatura</option>
                  <option value="Kira">Kira</option>
                  <option value="Abonelik">Abonelik</option>
                  <option value="Kredi">Kredi/Taksit</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Tutar (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amountMin}
                  onChange={(e) => setFormData({ ...formData, amountMin: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Tutar (₺) - Opsiyonel
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amountMax}
                  onChange={(e) => setFormData({ ...formData, amountMax: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  placeholder="Değişken gider ise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ayın Kaçında Ödenir
                </label>
                <select
                  value={formData.dueDay}
                  onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  required
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              💡 İpucu: Elektrik, su gibi değişken giderler için hem minimum hem maximum tutar girin (örn: 300-700 TL arası)
            </p>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Güncelle' : 'Ekle'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingId(null)
                }}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-6 py-2 rounded-lg transition-colors"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Aktif Sabit Giderler
          </h3>
          <div className="space-y-3">
            {activeCosts.map((item) => (
              <FixedCostCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggle={toggleActive}
              />
            ))}
            {activeCosts.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Aktif sabit gider yok
              </div>
            )}
          </div>
        </div>

        {inactiveCosts.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Devre Dışı Giderler
            </h3>
            <div className="space-y-3">
              {inactiveCosts.map((item) => (
                <FixedCostCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={toggleActive}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function FixedCostCard({
  item,
  onEdit,
  onDelete,
  onToggle,
}: {
  item: FixedCost
  onEdit: (item: FixedCost) => void
  onDelete: (id: string) => void
  onToggle: (id: string, isActive: boolean) => void
}) {
  const amountDisplay = item.amountMax
    ? `₺${parseFloat(item.amountMin).toLocaleString('tr-TR')} - ₺${parseFloat(item.amountMax).toLocaleString('tr-TR')}`
    : `₺${parseFloat(item.amountMin).toLocaleString('tr-TR')}`

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border ${item.isActive ? 'border-purple-200 dark:border-purple-800' : 'border-gray-200 dark:border-gray-700 opacity-60'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.name}
            </h4>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 rounded text-xs text-purple-700 dark:text-purple-400">
              {item.category}
            </span>
          </div>
          <p className="text-xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            {amountDisplay}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <CalendarIcon size={16} />
            <span>Her ayın {item.dueDay}. günü</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => onToggle(item.id, item.isActive)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              item.isActive
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300'
                : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200'
            }`}
          >
            {item.isActive ? 'Devre Dışı' : 'Etkinleştir'}
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
          >
            <Edit size={18} className="text-purple-600 dark:text-purple-400" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <Trash2 size={18} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  )
}
