'use client'

import { useEffect, useState } from 'react'
import { useDeadlineStore } from '@/store/deadlineStore'
import { useTaskStore } from '@/store/taskStore'
import StatCard from '@/components/StatCard'
import DeadlineItem from '@/components/DeadlineItem'
import TaskItem from '@/components/TaskItem'
import AddDeadlineForm from '@/components/AddDeadlineForm'
import AddTaskForm from '@/components/AddTaskForm'

export default function Home() {
  const { deadlines, fetchDeadlines, deleteDeadline } = useDeadlineStore()
  const { tasks, fetchTasks, toggleTask, deleteTask } = useTaskStore()
  
  const [activeTab, setActiveTab] = useState<'sureler' | 'gorevler'>('sureler')
  const [showDeadlineForm, setShowDeadlineForm] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    fetchDeadlines()
    fetchTasks()
  }, [fetchDeadlines, fetchTasks])

  // İstatistikler
  const acilSureler = deadlines.filter(d => d.aciliyet === 'acil').length
  const yakinSureler = deadlines.filter(d => d.aciliyet === 'yakin').length
  const toplamAktif = deadlines.length
  const bugunkuGorevler = tasks.filter(t => !t.tamamlandi).length

  // Sıralama
  const sortedDeadlines = [...deadlines].sort((a, b) => a.kalanGun - b.kalanGun)
  const activeTasks = tasks.filter(t => !t.tamamlandi)
  const completedTasks = tasks.filter(t => t.tamamlandi)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="card mb-6">
        <h1 className="text-3xl font-bold mb-1">⚖️ Avukat Yönetim Sistemi</h1>
        <p className="text-gray-500">Av. İbrahim Halil BİNGÖL - Ankara Barosu</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard number={acilSureler} label="ACİL SÜRELER" type="urgent" icon="🔴" />
        <StatCard number={yakinSureler} label="YAKIN SÜRELER" type="warning" icon="🟡" />
        <StatCard number={bugunkuGorevler} label="AKTİF GÖREVLER" type="tasks" icon="✅" />
        <StatCard number={toplamAktif} label="TOPLAM AKTİF" type="safe" icon="📊" />
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setActiveTab('sureler')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'sureler'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          📅 Süreler
        </button>
        <button
          onClick={() => setActiveTab('gorevler')}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === 'gorevler'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          ✅ Yapılacaklar
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {activeTab === 'sureler' ? (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">📋 Yaklaşan Süreler</h2>
                <button
                  onClick={() => setShowDeadlineForm(true)}
                  className="btn-primary"
                >
                  + Yeni Süre Ekle
                </button>
              </div>

              {sortedDeadlines.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Henüz süre eklenmemiş
                </div>
              ) : (
                <div>
                  {sortedDeadlines.map(deadline => (
                    <DeadlineItem
                      key={deadline._id}
                      deadline={deadline}
                      onDelete={deleteDeadline}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">✅ Görevler</h2>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="btn-primary"
                >
                  + Görev Ekle
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Henüz görev eklenmemiş
                </div>
              ) : (
                <div>
                  {/* Aktif Görevler */}
                  {activeTasks.length > 0 && (
                    <>
                      <h3 className="font-semibold mb-3 text-gray-700">Aktif Görevler</h3>
                      {activeTasks.map(task => (
                        <TaskItem
                          key={task._id}
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </>
                  )}

                  {/* Tamamlanan Görevler */}
                  {completedTasks.length > 0 && (
                    <>
                      <h3 className="font-semibold mt-6 mb-3 text-gray-700">
                        Tamamlanan Görevler
                      </h3>
                      {completedTasks.map(task => (
                        <TaskItem
                          key={task._id}
                          task={task}
                          onToggle={toggleTask}
                          onDelete={deleteTask}
                        />
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Bugün Özeti */}
          <div className="card">
            <h3 className="font-bold mb-4">📆 Bugün</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-semibold text-sm">🔴 {acilSureler} Acil Süre</div>
                <div className="text-xs text-gray-600 mt-1">3 gün içinde</div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-semibold text-sm">🟡 {yakinSureler} Yakın Süre</div>
                <div className="text-xs text-gray-600 mt-1">7 gün içinde</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-sm">✅ {bugunkuGorevler} Aktif Görev</div>
                <div className="text-xs text-gray-600 mt-1">Tamamlanmayı bekliyor</div>
              </div>
            </div>
          </div>

          {/* Hızlı Ekle */}
          <div className="card">
            <h3 className="font-bold mb-4">⚡ Hızlı Ekle</h3>
            <div className="space-y-2">
              <button
                onClick={() => setShowDeadlineForm(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📅 Duruşma
              </button>
              <button
                onClick={() => setShowDeadlineForm(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📤 İstinaf/Temyiz
              </button>
              <button
                onClick={() => setShowTaskForm(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✅ Görev Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeadlineForm && <AddDeadlineForm onClose={() => setShowDeadlineForm(false)} />}
      {showTaskForm && <AddTaskForm onClose={() => setShowTaskForm(false)} />}
    </div>
  )
}
