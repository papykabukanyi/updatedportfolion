import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pkvault.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PK Vault | Admin Dashboard — Papy Kabukanyi',
    template: '%s | PK Vault',
  },
  description:
    'PK Vault — private admin dashboard for Papy Kabukanyi. Manage content, leads, analytics, and settings across all platforms. Access restricted.',
  keywords: ['PK Vault', 'admin dashboard', 'papykabukanyi admin', 'PK admin', 'private dashboard'],
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  applicationName: 'PK Vault',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0b0f',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PK Vault',
  description: 'Private admin dashboard for Papy Kabukanyi.',
  url: SITE_URL,
  author: { '@type': 'Person', name: 'Papy Kabukanyi' },
  applicationCategory: 'BusinessApplication',
  accessibilityFeature: 'none',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="font-sans">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5C2QMZDQ" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <LangProvider>{children}</LangProvider>
        <Script id="gtm-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5C2QMZDQ');` }} />
        <Script id="ga4-src" src="https://www.googletagmanager.com/gtag/js?id=G-GC9CLZ5PT4" strategy="afterInteractive" />
        <Script id="ga4-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GC9CLZ5PT4',{send_page_view:true});` }} />
      </body>
    </html>
  )
}
