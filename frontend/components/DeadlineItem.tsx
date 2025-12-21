import { Deadline } from '@/store/deadlineStore'
import { formatTarih } from '@/lib/dateUtils'
import { FiTrash2 } from 'react-icons/fi'

interface DeadlineItemProps {
  deadline: Deadline
  onDelete: (id: string) => void
}

export default function DeadlineItem({ deadline, onDelete }: DeadlineItemProps) {
  const bgColors = {
    acil: 'bg-red-50 border-urgent',
    yakin: 'bg-orange-50 border-warning',
    guvenli: 'bg-green-50 border-safe',
  }

  const textColors = {
    acil: 'text-urgent',
    yakin: 'text-warning',
    guvenli: 'text-safe',
  }

  const turLabels: Record<string, string> = {
    durusma: 'Duruşma',
    istinaf: 'İstinaf Süresi',
    temyiz: 'Temyiz Süresi',
    cevap_layihasi: 'Cevap Layihası',
    tebligat: 'Tebligat Bekleme',
    kesif: 'Keşif',
    bilirkisi: 'Bilirkişi Raporu',
  }

  return (
    <div className={`p-4 rounded-lg border-l-4 ${bgColors[deadline.aciliyet]} mb-3`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 mb-2">
            {deadline.baslik}
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <span>📁 {deadline.dosyaNo || 'Dosya No Yok'}</span>
            <span>⚖️ {deadline.mahkeme || 'Mahkeme Belirtilmedi'}</span>
            <span>📅 {formatTarih(deadline.sonGun, 'dd.MM.yyyy HH:mm')}</span>
            <span className={`font-bold ${textColors[deadline.aciliyet]}`}>
              ⏰ {deadline.kalanGun} GÜN KALDI
            </span>
          </div>
          {deadline.notlar && (
            <div className="mt-2 text-sm text-gray-500">
              📝 {deadline.notlar}
            </div>
          )}
        </div>
        <button
          onClick={() => deadline._id && onDelete(deadline._id)}
          className="ml-4 p-2 hover:bg-red-100 rounded-lg transition-colors"
        >
          <FiTrash2 className="text-red-500" />
        </button>
      </div>
    </div>
  )
}
