import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Deadline {
  _id?: string
  baslik: string
  tur: 'durusma' | 'istinaf' | 'temyiz' | 'cevap_layihasi' | 'tebligat' | 'kesif' | 'bilirkisi'
  tebligatTarihi: string
  sonGun: string
  dosyaNo?: string
  mahkeme?: string
  notlar?: string
  aciliyet: 'acil' | 'yakin' | 'guvenli'
  kalanGun: number
}

interface DeadlineStore {
  deadlines: Deadline[]
  loading: boolean
  error: string | null
  fetchDeadlines: () => Promise<void>
  addDeadline: (deadline: Omit<Deadline, '_id' | 'aciliyet' | 'kalanGun'>) => Promise<void>
  deleteDeadline: (id: string) => Promise<void>
}

export const useDeadlineStore = create<DeadlineStore>((set, get) => ({
  deadlines: [],
  loading: false,
  error: null,

  fetchDeadlines: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/api/sureler`)
      set({ deadlines: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addDeadline: async (deadline) => {
    set({ loading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/api/sureler`, deadline)
      await get().fetchDeadlines()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteDeadline: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`${API_URL}/api/sureler/${id}`)
      await get().fetchDeadlines()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
