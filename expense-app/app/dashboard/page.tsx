'use client'

import { useEffect, useState } from 'react'
import { TrendingDown, TrendingUp, Wallet, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalExpenses: number
  totalIncome: number
  balance: number
  fixedCostsCount: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalExpenses: 0,
    totalIncome: 0,
    balance: 0,
    fixedCostsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()

      const [expensesRes, incomeRes, fixedCostsRes] = await Promise.all([
        fetch(`/api/expenses?month=${month}&year=${year}`),
        fetch(`/api/income?month=${month}&year=${year}`),
        fetch('/api/fixed-costs'),
      ])

      const expenses = await expensesRes.json()
      const income = await incomeRes.json()
      const fixedCosts = await fixedCostsRes.json()

      const totalExpenses = expenses.reduce(
        (sum: number, e: any) => sum + parseFloat(e.amount),
        0
      )
      const totalIncome = income.reduce(
        (sum: number, i: any) => sum + parseFloat(i.amount),
        0
      )

      setStats({
        totalExpenses,
        totalIncome,
        balance: totalIncome - totalExpenses,
        fixedCostsCount: fixedCosts.filter((fc: any) => fc.isActive).length,
      })
    } catch (error) {
      console.error('Stats yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const now = new Date()
  const monthName = now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ana Sayfa
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {monthName} dönemi özeti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Toplam Gelir"
          value={`₺${stats.totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon={<TrendingUp className="text-green-500" size={24} />}
          color="green"
        />
        <StatCard
          title="Toplam Gider"
          value={`₺${stats.totalExpenses.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon={<TrendingDown className="text-red-500" size={24} />}
          color="red"
        />
        <StatCard
          title="Kalan"
          value={`₺${stats.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
          icon={<Wallet className="text-blue-500" size={24} />}
          color={stats.balance >= 0 ? 'green' : 'red'}
        />
        <StatCard
          title="Sabit Giderler"
          value={stats.fixedCostsCount.toString()}
          icon={<Calendar className="text-purple-500" size={24} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/dashboard/expenses" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Harcamalar
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Günlük harcamalarınızı ekleyin ve takip edin
            </p>
          </div>
        </Link>

        <Link href="/dashboard/income" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="text-green-600 dark:text-green-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gelirler
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gelir kaynaklarınızı yönetin
            </p>
          </div>
        </Link>

        <Link href="/dashboard/fixed-costs" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Calendar className="text-purple-600 dark:text-purple-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sabit Giderler
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Aylık sabit giderlerinizi tanımlayın
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}) {
  const colorClasses = {
    green: 'border-green-200 dark:border-green-800',
    red: 'border-red-200 dark:border-red-800',
    blue: 'border-blue-200 dark:border-blue-800',
    purple: 'border-purple-200 dark:border-purple-800',
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </h3>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  )
}
