'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit, Search } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

interface Income {
  id: string
  amount: string
  source: string
  description: string | null
  date: string
  isRecurring: boolean
}

interface Category {
  id: string
  name: string
  icon: string | null
}

export default function IncomePage() {
  const [income, setIncome] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    isRecurring: false,
  })

  useEffect(() => {
    fetchIncome()
    fetchCategories()
  }, [])

  const fetchIncome = async () => {
    try {
      const res = await fetch('/api/income')
      const data = await res.json()
      setIncome(data)
    } catch (error) {
      toast.error('Gelirler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?type=income')
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editingId ? `/api/income/${editingId}` : '/api/income'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error()

      toast.success(editingId ? 'Gelir güncellendi' : 'Gelir eklendi')
      setShowForm(false)
      setEditingId(null)
      setFormData({
        amount: '',
        source: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
      })
      fetchIncome()
    } catch (error) {
      toast.error('İşlem başarısız')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu geliri silmek istediğinize emin misiniz?')) return

    try {
      await fetch(`/api/income/${id}`, { method: 'DELETE' })
      toast.success('Gelir silindi')
      fetchIncome()
    } catch (error) {
      toast.error('Silme işlemi başarısız')
    }
  }

  const handleEdit = (item: Income) => {
    setEditingId(item.id)
    setFormData({
      amount: item.amount,
      source: item.source,
      description: item.description || '',
      date: item.date.split('T')[0],
      isRecurring: item.isRecurring,
    })
    setShowForm(true)
  }

  const filteredIncome = income.filter((item) =>
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const total = filteredIncome.reduce((sum, i) => sum + parseFloat(i.amount), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gelirler
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Toplam: ₺{total.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              amount: '',
              source: '',
              description: '',
              date: new Date().toISOString().split('T')[0],
              isRecurring: false,
            })
          }}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={20} />
          Yeni Gelir
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingId ? 'Gelir Düzenle' : 'Yeni Gelir Ekle'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tutar (₺)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kaynak
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">Seçiniz...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                  placeholder="Opsiyonel"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="isRecurring" className="text-sm text-gray-700 dark:text-gray-300">
                Düzenli gelir (maaş gibi)
              </label>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
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

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredIncome.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl font-bold text-green-600 dark:text-green-400">
                  ₺{parseFloat(item.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
                  {item.source}
                </span>
                {item.isRecurring && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 rounded text-xs text-green-700 dark:text-green-400">
                    Düzenli
                  </span>
                )}
              </div>
              {item.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {item.description}
                </p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-500">
                {format(new Date(item.date), 'dd MMMM yyyy', { locale: tr })}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              >
                <Edit size={18} className="text-green-600 dark:text-green-400" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 size={18} className="text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))}

        {filteredIncome.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Henüz gelir eklenmemiş
          </div>
        )}
      </div>
    </div>
  )
}
