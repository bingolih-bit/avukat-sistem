import { Task } from '@/store/taskStore'
import { FiTrash2 } from 'react-icons/fi'

interface TaskItemProps {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const priorityColors = {
    yuksek: 'bg-red-100 text-urgent',
    orta: 'bg-orange-100 text-warning',
    dusuk: 'bg-blue-100 text-primary',
  }

  const priorityLabels = {
    yuksek: 'ÖNCELİKLİ',
    orta: 'ORTA',
    dusuk: 'DÜŞÜK',
  }

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg bg-gray-50 mb-3 ${task.tamamlandi ? 'opacity-60' : ''}`}>
      <button
        onClick={() => task._id && onToggle(task._id)}
        className={`w-6 h-6 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
          task.tamamlandi
            ? 'bg-primary border-primary'
            : 'border-primary hover:bg-blue-50'
        }`}
      >
        {task.tamamlandi && (
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        <div className={`font-semibold mb-2 ${task.tamamlandi ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.baslik}
        </div>
        {task.aciklama && (
          <div className="text-sm text-gray-600 mb-2">{task.aciklama}</div>
        )}
        <div className="flex flex-wrap gap-2 text-sm">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${priorityColors[task.oncelik]}`}>
            {priorityLabels[task.oncelik]}
          </span>
          {task.dosyaNo && (
            <span className="text-gray-600">📁 {task.dosyaNo}</span>
          )}
          {task.tarih && (
            <span className="text-gray-600">📅 {task.tarih}</span>
          )}
          {task.saat && (
            <span className="text-gray-600">⏰ {task.saat}</span>
          )}
        </div>
      </div>

      <button
        onClick={() => task._id && onDelete(task._id)}
        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
      >
        <FiTrash2 className="text-red-500" />
      </button>
    </div>
  )
}
