export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-4">
              <span className="text-4xl">💰</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Harcama Gelir Takip
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kişisel finans yönetim sisteminiz
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="/auth/login"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Giriş Yap
            </a>
            <a
              href="/auth/register"
              className="block w-full bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg border-2 border-gray-200 dark:border-gray-600 transition-colors"
            >
              Kayıt Ol
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              ✨ Özellikler
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Detaylı Raporlar</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💳</span>
                <span>Harcama Takibi</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💰</span>
                <span>Gelir Yönetimi</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔔</span>
                <span>Hatırlatmalar</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
