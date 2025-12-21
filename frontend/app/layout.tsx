import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Avukat Yönetim Sistemi',
  description: 'Süre takip ve görev yönetimi sistemi',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <main className="min-h-screen p-4 md:p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
