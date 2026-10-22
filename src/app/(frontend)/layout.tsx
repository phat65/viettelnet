import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ContactButtons } from '@/components/layout/ContactButtons'
import { getSiteSettings } from '@/lib/queries'
import { ConsultationProvider } from '@/components/forms/ConsultationProvider'
import './globals.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  title: { default: 'Internet Viettel — WiFi cho mọi nhà', template: '%s | Internet Viettel' },
  description: 'Tìm hiểu gói Internet, TV360 và Camera. Đăng ký tư vấn lắp đặt theo khu vực.',
  icons: { icon: '/favicon.ico?v=viettel-20261022', shortcut: '/favicon.ico?v=viettel-20261022' },
}

export default async function Layout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()
  return <html lang="vi"><head>
    <link rel="preload" href="/fonts/sarabun-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/beau-sans-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
  </head><body><ConsultationProvider>
    <a className="skip-link" href="#main">Đến nội dung chính</a>
    <Header /><main id="main">{children}</main>
    <Footer settings={settings} /><ContactButtons contacts={settings.contacts} />
  </ConsultationProvider></body></html>
}
