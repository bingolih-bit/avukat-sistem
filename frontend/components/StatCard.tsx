interface StatCardProps {
  number: number
  label: string
  type: 'urgent' | 'warning' | 'safe' | 'tasks'
  icon: string
}

export default function StatCard({ number, label, type, icon }: StatCardProps) {
  const colors = {
    urgent: 'border-urgent text-urgent',
    warning: 'border-warning text-warning',
    safe: 'border-safe text-safe',
    tasks: 'border-primary text-primary',
  }

  return (
    <div className={`card border-l-4 ${colors[type]}`}>
      <div className="text-4xl font-bold mb-1">{number}</div>
      <div className="text-sm text-gray-500">{icon} {label}</div>
    </div>
  )
}
