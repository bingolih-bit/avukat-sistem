import './globals.css'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

// SSR devre dışı - sadece client-side render
const PWAInstaller = dynamic(() => import('@/components/PWAInstaller'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Avukat Asistan',
  description: 'Süre takip, duruşma yönetimi ve avukatlık işleri asistanı',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Avukat Asistan',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <PWAInstaller />
        <main className="min-h-screen p-4 md:p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
