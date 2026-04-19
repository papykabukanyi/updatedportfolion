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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crow.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CROW News | Independent. Unfiltered. Austin.',
    template: '%s | CROW News',
  },
  description:
    'CROW News â€” independent, unfiltered news and commentary. Breaking stories, in-depth analysis, investigative journalism, and local Austin TX coverage. Powered by Papy Kabukanyi.',
  keywords: [
    'CROW News', 'CROW news Austin', 'independent news Austin TX',
    'unfiltered news Austin', 'Austin TX news', 'Austin news today',
    'Austin breaking news', 'Austin local news', 'Austin investigative journalism',
    'Austin commentary', 'Austin politics', 'Austin tech news',
    'Central Texas news', 'Texas news', 'indie news outlet',
    'independent journalism Austin', 'online news Austin',
    'Papy Kabukanyi news', 'CROW independent media',
    'Austin news blog', 'Austin newsletter', 'news startup Austin',
    'Cedar Park news', 'Round Rock news', 'Georgetown TX news',
    'Pflugerville news', 'Kyle TX news', 'San Marcos news',
    'noticias Austin TX', 'nouvelles Austin TX', 'Austin Ð½Ð¾Ð²Ð¾ÑÑ‚Ð¸',
    'Austin habari',
  ],
  authors: [{ name: 'CROW News', url: SITE_URL }],
  creator: 'Papy Kabukanyi',
  publisher: 'CROW News',
  alternates: { canonical: SITE_URL },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'CROW News',
    title: 'CROW News | Independent. Unfiltered. Austin.',
    description: 'Independent, unfiltered news and commentary. Breaking stories and in-depth analysis from Austin TX.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CROW News | Independent. Unfiltered. Austin.',
    description: 'Independent news and commentary from Austin TX. Unfiltered coverage you can trust.',
    creator: '@papykabukanyi',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Austin, Texas',
    'geo.position': '30.2672;-97.7431',
    'ICBM': '30.2672, -97.7431',
  },
  applicationName: 'CROW News',
  category: 'news',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0214',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'NewsMediaOrganization',
  name: 'CROW News',
  alternateName: 'CROW',
  url: SITE_URL,
  description: 'Independent, unfiltered digital news outlet covering Austin TX and beyond. Founded by Papy Kabukanyi.',
  email: 'papykabukanyi@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  founder: { '@type': 'Person', name: 'Papy Kabukanyi', url: 'https://hire-papy.up.railway.app' },
  foundingDate: '2024',
  knowsAbout: ['Local News', 'Investigative Journalism', 'Austin TX Politics', 'Texas News', 'Commentary'],
  areaServed: [
    { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'State', name: 'Texas' },
    { '@type': 'Country', name: 'United States' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5C2QMZDQ" height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        <LangProvider>{children}</LangProvider>
        <Script id="gtm-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5C2QMZDQ');` }} />
        <Script id="ga4-src" src="https://www.googletagmanager.com/gtag/js?id=G-GC9CLZ5PT4" strategy="afterInteractive" />
        <Script id="ga4-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GC9CLZ5PT4',{send_page_view:true});` }} />
        <Script id="crow-ga4-src" src="https://www.googletagmanager.com/gtag/js?id=G-RVLWCSLD9P" strategy="afterInteractive" />
        <Script id="crow-ga4-config" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-RVLWCSLD9P',{send_page_view:true});` }} />
      </body>
    </html>
  )
}
