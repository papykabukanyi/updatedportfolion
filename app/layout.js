import { Inter, Oswald } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papy-construction.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Papy Construction & Demolition | Licensed Contractor — Austin, TX",
    template: "%s | Papy Construction & Demolition",
  },
  description:
    "Austin TX licensed construction & demolition contractor. Residential & commercial demolition, site clearing, interior demo, concrete breaking, debris removal. Serving Austin, Cedar Park, Round Rock, Kyle, Buda & Georgetown. Free estimates!",
  keywords: [
    'Papy Construction','Papy Demolition','Papy C&D Austin',
    'demolition contractor Austin TX','construction company Austin TX',
    'residential demolition Austin','commercial demolition Austin',
    'interior demolition Austin','site clearing Austin TX',
    'concrete demolition Austin','house demolition Austin TX',
    'debris removal Austin TX','land clearing Austin TX',
    'pool demolition Austin TX','garage demolition Austin',
    'demolition contractor Cedar Park TX','demolition contractor Round Rock TX',
    'demolition contractor Kyle TX','demolition contractor Buda TX',
    'demolition contractor Georgetown TX','demolition contractor Dripping Springs TX',
    'licensed demolition contractor Texas','free demolition estimate Austin',
    'affordable demolition Austin','new construction Austin TX',
    'renovation contractor Austin','concrete breaker Austin TX',
  ],
  authors: [{ name: 'Papy Construction & Demolition', url: SITE_URL }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website', locale: 'en_US', url: SITE_URL,
    siteName: 'Papy Construction & Demolition',
    title: 'Papy Construction & Demolition | Austin TX Licensed Contractor',
    description: 'Licensed demolition & construction contractor serving Austin TX. Free estimates.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papy Construction & Demolition | Austin TX',
    description: 'Licensed demolition & construction contractor. Free estimates. Austin TX.',
  },
  other: {
    'geo.region': 'US-TX', 'geo.placename': 'Austin',
    'geo.position': '30.2672;-97.7431', 'ICBM': '30.2672, -97.7431',
  },
}

export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#0a0c10',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Papy Construction & Demolition',
  description: 'Licensed demolition and construction contractor serving Austin TX and surrounding areas.',
  url: SITE_URL,
  telephone: '+15128675309',
  email: 'papykabukanyi@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Austin', addressRegion: 'TX', addressCountry: 'US' },
  areaServed: [
    'Austin, TX','Cedar Park, TX','Round Rock, TX','Kyle, TX','Buda, TX',
    'Georgetown, TX','Pflugerville, TX','Dripping Springs, TX','San Marcos, TX','Leander, TX',
  ],
  serviceType: ['Demolition','Construction','Site Clearing','Interior Demolition','Concrete Breaking','Debris Removal'],
  priceRange: '$$',
  openingHours: 'Mo-Sa 07:00-18:00',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="bg-[#0a0c10] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}