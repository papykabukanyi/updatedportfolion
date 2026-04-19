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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papys-store.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Papi's Store | Austin TX Online Shop â€” Quality Finds",
    template: "%s | Papi's Store",
  },
  description:
    "Papi's Store â€” quality products, unique finds, fast shipping. Austin TX based online shop curated by Papy Kabukanyi. Shop apparel, accessories, tech, and more.",
  keywords: [
    "Papi's Store", "Papi Store Austin", "Papys Store online",
    'online shop Austin TX', 'Austin TX online store', 'buy Austin TX',
    'unique products Austin', 'curated shop Austin', 'Austin boutique shop',
    'Papy Kabukanyi store', 'papykabukanyi shop', 'PK store',
    'Austin fashion store', 'Austin accessories online', 'Austin gifts',
    'Austin TX ecommerce', 'buy online Austin Texas', 'free shipping Austin',
    'tienda en linea Austin', 'boutique en ligne Austin',
    'Ð¸Ð½Ñ‚ÐµÑ€Ð½ÐµÑ‚ Ð¼Ð°Ð³Ð°Ð·Ð¸Ð½ ÐžÑÑ‚Ð¸Ð½', 'duka la mtandao Austin',
    'shop apparel Austin', 'shop accessories Austin', 'shop tech Austin',
    'quality finds online', 'small business Austin TX', 'support local Austin',
    'Cedar Park TX online shop', 'Round Rock TX shop', 'Georgetown TX store',
  ],
  authors: [{ name: "Papi's Store", url: SITE_URL }],
  creator: 'Papy Kabukanyi',
  publisher: "Papi's Store",
  alternates: { canonical: SITE_URL },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: "Papi's Store",
    title: "Papi's Store | Austin TX Online Shop",
    description: 'Quality products and unique finds. Austin TX based online shop with fast shipping.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Papi's Store | Austin TX Online Shop",
    description: "Quality products, unique finds and fast shipping from Austin TX.",
    creator: '@papykabukanyi',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Austin, Texas',
    'geo.position': '30.2672;-97.7431',
    'ICBM': '30.2672, -97.7431',
  },
  applicationName: "Papi's Store",
  category: 'shopping',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0a0500',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: "Papi's Store",
  alternateName: ['Papys Store', 'PK Store'],
  url: SITE_URL,
  description: "Austin TX based online shop curated by Papy Kabukanyi. Quality products with fast shipping.",
  email: 'papykabukanyi@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  founder: { '@type': 'Person', name: 'Papy Kabukanyi', url: 'https://hire-papy.up.railway.app' },
  priceRange: '$$',
  openingHours: 'Mo-Su 00:00-23:59',
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Debit Card',
  areaServed: [
    { '@type': 'Country', name: 'United States' },
    { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
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
      </body>
    </html>
  )
}
