import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface Task {
  _id?: string
  baslik: string
  aciklama?: string
  dosyaNo?: string
  oncelik: 'yuksek' | 'orta' | 'dusuk'
  tarih?: string
  saat?: string
  tamamlandi: boolean
  olusturmaTarihi: string
}

interface TaskStore {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (task: Omit<Task, '_id' | 'tamamlandi' | 'olusturmaTarihi'>) => Promise<void>
  toggleTask: (id: string) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null })
    try {
      const response = await axios.get(`${API_URL}/api/gorevler`)
      set({ tasks: response.data, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  addTask: async (task) => {
    set({ loading: true, error: null })
    try {
      await axios.post(`${API_URL}/api/gorevler`, task)
      await get().fetchTasks()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  toggleTask: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.patch(`${API_URL}/api/gorevler/${id}/toggle`)
      await get().fetchTasks()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null })
    try {
      await axios.delete(`${API_URL}/api/gorevler/${id}`)
      await get().fetchTasks()
    } catch (error: any) {
      set({ error: error.message, loading: false })
    }
  },
}))
