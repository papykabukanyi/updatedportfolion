import { Inter, Oswald } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papy-construction.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Papy Construction & Demolition | Licensed Contractor — Austin, TX',
    template: '%s | Papy Construction & Demolition',
  },
  description:
    "Austin TX's most trusted licensed construction & demolition contractor. Residential & commercial demolition, site clearing, interior demo, concrete breaking, debris removal. Serving Austin, Cedar Park, Round Rock, Kyle, Buda, Georgetown & surrounding areas. Free estimates — call now!",
  keywords: [
    'Papy Construction', 'Papy Demolition', 'Papy Construction and Demolition', 'Papy C&D Austin',
    'demolition contractor Austin TX', 'construction company Austin TX', 'demolition services Austin',
    'residential demolition Austin', 'commercial demolition Austin', 'interior demolition Austin',
    'site clearing Austin TX', 'concrete demolition Austin', 'structure demolition Austin',
    'building demolition Austin', 'house demolition Austin TX', 'selective demolition Austin',
    'debris removal Austin TX', 'excavation Austin TX', 'land clearing Austin TX',
    'pool demolition Austin TX', 'garage demolition Austin', 'apartment demolition Austin',
    'commercial build out Austin', 'tenant improvement Austin TX',
    'demolition contractor Cedar Park TX', 'demolition contractor Round Rock TX',
    'demolition contractor Kyle TX', 'demolition contractor Buda TX',
    'demolition contractor Georgetown TX', 'demolition contractor Pflugerville TX',
    'demolition contractor Dripping Springs TX', 'demolition contractor San Marcos TX',
    'construction contractor Cedar Park', 'construction contractor Round Rock',
    'licensed demolition contractor Texas', 'free demolition estimate Austin',
    'affordable demolition Austin', 'fast demolition Austin', 'same week demolition Austin',
    'concrete breaker Austin TX', 'new construction Austin TX', 'renovation contractor Austin',
  ],
  authors: [{ name: 'Papy Construction & Demolition', url: SITE_URL }],
  creator: 'Papy Construction & Demolition',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website', locale: 'en_US', url: SITE_URL,
    siteName: 'Papy Construction & Demolition',
    title: 'Papy Construction & Demolition | Austin TX Licensed Contractor',
    description: 'Licensed demolition & construction contractor serving Austin TX and surrounding areas. Free estimates.',
    images: [{ url: `${SITE_URL}/og-construction.jpg`, width: 1200, height: 630, alt: 'Papy Construction & Demolition — Austin TX' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papy Construction & Demolition | Austin TX',
    description: 'Licensed demolition & construction contractor. Free estimates. Austin TX & surrounding cities.',
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
    'Austin, TX', 'Cedar Park, TX', 'Round Rock, TX', 'Kyle, TX', 'Buda, TX',
    'Georgetown, TX', 'Pflugerville, TX', 'Dripping Springs, TX', 'San Marcos, TX',
    'Bastrop, TX', 'Leander, TX', 'Manor, TX',
  ],
  serviceType: ['Demolition', 'Construction', 'Site Clearing', 'Interior Demolition', 'Concrete Breaking', 'Debris Removal', 'Renovation', 'Land Clearing'],
  priceRange: '$$',
  openingHours: 'Mo-Sa 07:00-18:00',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Construction & Demolition Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Demolition', areaServed: 'Austin, TX' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Demolition', areaServed: 'Austin, TX' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Demolition', areaServed: 'Austin, TX' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Site Clearing', areaServed: 'Austin, TX' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Concrete Breaking', areaServed: 'Austin, TX' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Debris Removal', areaServed: 'Austin, TX' } },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#0a0c10] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
  title: {
    default: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer — Austin, TX',
    template: '%s | Papy Kabukanyi',
  },
  description:
    'Papy Kabukanyi is a Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Specializing in React, Next.js, Node.js, Python, AWS cloud architecture, and LLM integration. Available for hire.',
  keywords: [
    // ── Name variants ──────────────────────────────────────────────────────
    'Papy Kabukanyi',
    'papykabukanyi',
    'Papy Kabukanyi developer',
    'Papy Kabukanyi web developer',
    'Papy Kabukanyi portfolio',
    'hire Papy Kabukanyi',
    // ── Role ───────────────────────────────────────────────────────────────
    'full stack developer',
    'web developer',
    'AI prompt engineer',
    'React developer',
    'Next.js developer',
    'Node.js developer',
    'Python developer',
    'AWS solutions architect',
    'freelance web developer',
    'LLM integration',
    'UI UX designer',
    'Salesforce administrator',
    'software engineer for hire',
    'remote web developer',
    'contract developer',
    // ── Austin TX neighborhoods / areas ────────────────────────────────────
    'web developer Austin TX',
    'web developer Austin Texas',
    'developer downtown Austin',
    'developer East Austin',
    'developer South Austin',
    'developer North Austin',
    'developer West Austin',
    'developer Cedar Park TX',
    'developer Round Rock TX',
    'developer Pflugerville TX',
    'developer Georgetown TX',
    'developer Kyle TX',
    'developer Buda TX',
    'developer Leander TX',
    'developer Manor TX',
    'developer Hyde Park Austin',
    'developer Zilker Austin',
    'developer Mueller Austin',
    'developer Domain Austin',
    'developer South Congress Austin',
    'developer Barton Hills Austin',
    'developer Cherrywood Austin',
    // ── US cities ──────────────────────────────────────────────────────────
    'web developer New York',
    'web developer Los Angeles',
    'web developer San Francisco',
    'web developer Seattle',
    'web developer Chicago',
    'web developer Houston',
    'web developer Dallas',
    'web developer Denver',
    'web developer Miami',
    'web developer Boston',
    'web developer Atlanta',
    'web developer Portland',
    'web developer Phoenix',
    'web developer Las Vegas',
    'web developer Washington DC',
    // ── Europe ─────────────────────────────────────────────────────────────
    'web developer London',
    'web developer Paris',
    'web developer Berlin',
    'web developer Amsterdam',
    'web developer Madrid',
    'web developer Barcelona',
    'web developer Rome',
    'web developer Milan',
    'web developer Brussels',
    'web developer Zurich',
    'web developer Geneva',
    'web developer Stockholm',
    'web developer Copenhagen',
    'web developer Oslo',
    'web developer Helsinki',
    'web developer Vienna',
    'web developer Prague',
    'web developer Warsaw',
    'web developer Budapest',
    'web developer Lisbon',
    'web developer Dublin',
    'web developer Munich',
    'web developer Hamburg',
    'web developer Frankfurt',
    // ── Spanish-speaking world ──────────────────────────────────────────────
    'desarrollador web',
    'desarrollador web Austin',
    'desarrollador web Mexico',
    'desarrollador web Ciudad de Mexico',
    'desarrollador web Guadalajara',
    'desarrollador web Monterrey',
    'desarrollador web Madrid',
    'desarrollador web Barcelona',
    'desarrollador web Buenos Aires',
    'desarrollador web Bogota',
    'desarrollador web Lima',
    'desarrollador web Santiago',
    'desarrollador web Caracas',
    'desarrollador web San Jose',
    'desarrollador web Panama',
    'desarrollador web Guatemala',
    'desarrollador web La Habana',
    'desarrollador full stack',
    'ingeniero de software',
    'programador web freelance',
    // ── Russian-speaking world ──────────────────────────────────────────────
    'веб разработчик',
    'full stack разработчик',
    'веб разработчик Москва',
    'веб разработчик Санкт-Петербург',
    'веб разработчик Киев',
    'веб разработчик Минск',
    'веб разработчик Алматы',
    'веб разработчик Ташкент',
    'фрилансер разработчик',
    'разработчик React',
    'разработчик Node.js',
    // ── Swahili-speaking East Africa ───────────────────────────────────────
    'msanidi wavuti',
    'msanidi wavuti Nairobi',
    'msanidi wavuti Dar es Salaam',
    'msanidi wavuti Kampala',
    'msanidi wavuti Kigali',
    'msanidi wavuti Kinshasa',
    'msanidi wavuti Mombasa',
    'msanidi wavuti Arusha',
    'web developer Nairobi',
    'web developer Dar es Salaam',
    'web developer Kampala',
    'web developer Kigali',
    'web developer Kenya',
    'web developer Tanzania',
    'web developer Uganda',
    'web developer Rwanda',
  ],
  authors: [{ name: 'Papy Kabukanyi', url: SITE_URL }],
  creator: 'Papy Kabukanyi',
  publisher: 'Papy Kabukanyi',

  // ─── Canonical ───────────────────────────────────────────────────────────
  alternates: {
    canonical: '/',
  },

  // ─── Robots ──────────────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // ─── Open Graph ──────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Papy Kabukanyi Portfolio',
    title: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer',
    description:
      'Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Expert in React, Node.js, Python, AWS and LLM integration. Open to new opportunities.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papy Kabukanyi — Web Developer & AI Prompt Engineer',
      },
    ],
  },

  // ─── Twitter / X ─────────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer',
    description:
      'Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Available for hire.',
    images: ['/og-image.png'],
    creator: '@papykabukanyi',
  },

  // ─── Verification (add codes when you set up Search Console) ─────────────
  // verification: {
  //   google: 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN',
  // },

  // ─── App / PWA ────────────────────────────────────────────────────────────
  applicationName: 'Papy Kabukanyi Portfolio',
  category: 'technology',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050508',
}

// ─── JSON-LD Person schema ────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Papy Kabukanyi',
  url: SITE_URL,
  email: 'Papykabukanyi@gmail.com',
  telephone: '+17377106090',
  jobTitle: 'Web Developer & AI Prompt Engineer',
  description:
    'Full-Stack Web Developer and AI Prompt Engineer with expertise in React, Node.js, Python, AWS, and LLM integration. Based in Austin, TX.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    addressCountry: 'US',
  },
  sameAs: [
    'https://github.com/papykabukanyi',
    'https://www.linkedin.com/in/papykabukanyi',
  ],
  areaServed: [
    // Austin neighborhoods
    { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'Place', name: 'East Austin, TX' },
    { '@type': 'Place', name: 'South Austin, TX' },
    { '@type': 'Place', name: 'North Austin, TX' },
    { '@type': 'Place', name: 'West Austin, TX' },
    { '@type': 'Place', name: 'Downtown Austin, TX' },
    { '@type': 'Place', name: 'Hyde Park, Austin, TX' },
    { '@type': 'Place', name: 'Zilker, Austin, TX' },
    { '@type': 'Place', name: 'Mueller, Austin, TX' },
    { '@type': 'Place', name: 'The Domain, Austin, TX' },
    { '@type': 'Place', name: 'South Congress, Austin, TX' },
    { '@type': 'Place', name: 'Barton Hills, Austin, TX' },
    { '@type': 'Place', name: 'Cherrywood, Austin, TX' },
    { '@type': 'City', name: 'Cedar Park, TX' },
    { '@type': 'City', name: 'Round Rock, TX' },
    { '@type': 'City', name: 'Pflugerville, TX' },
    { '@type': 'City', name: 'Georgetown, TX' },
    { '@type': 'City', name: 'Kyle, TX' },
    { '@type': 'City', name: 'Buda, TX' },
    { '@type': 'City', name: 'Leander, TX' },
    // US cities
    { '@type': 'City', name: 'New York, NY' },
    { '@type': 'City', name: 'Los Angeles, CA' },
    { '@type': 'City', name: 'San Francisco, CA' },
    { '@type': 'City', name: 'Seattle, WA' },
    { '@type': 'City', name: 'Chicago, IL' },
    { '@type': 'City', name: 'Houston, TX' },
    { '@type': 'City', name: 'Dallas, TX' },
    { '@type': 'City', name: 'Miami, FL' },
    { '@type': 'City', name: 'Boston, MA' },
    { '@type': 'City', name: 'Atlanta, GA' },
    { '@type': 'City', name: 'Denver, CO' },
    // Europe
    { '@type': 'City', name: 'London', containedInPlace: { '@type': 'Country', name: 'United Kingdom' } },
    { '@type': 'City', name: 'Paris', containedInPlace: { '@type': 'Country', name: 'France' } },
    { '@type': 'City', name: 'Berlin', containedInPlace: { '@type': 'Country', name: 'Germany' } },
    { '@type': 'City', name: 'Amsterdam', containedInPlace: { '@type': 'Country', name: 'Netherlands' } },
    { '@type': 'City', name: 'Madrid', containedInPlace: { '@type': 'Country', name: 'Spain' } },
    { '@type': 'City', name: 'Barcelona', containedInPlace: { '@type': 'Country', name: 'Spain' } },
    { '@type': 'City', name: 'Rome', containedInPlace: { '@type': 'Country', name: 'Italy' } },
    { '@type': 'City', name: 'Milan', containedInPlace: { '@type': 'Country', name: 'Italy' } },
    { '@type': 'City', name: 'Brussels', containedInPlace: { '@type': 'Country', name: 'Belgium' } },
    { '@type': 'City', name: 'Zurich', containedInPlace: { '@type': 'Country', name: 'Switzerland' } },
    { '@type': 'City', name: 'Stockholm', containedInPlace: { '@type': 'Country', name: 'Sweden' } },
    { '@type': 'City', name: 'Copenhagen', containedInPlace: { '@type': 'Country', name: 'Denmark' } },
    { '@type': 'City', name: 'Oslo', containedInPlace: { '@type': 'Country', name: 'Norway' } },
    { '@type': 'City', name: 'Helsinki', containedInPlace: { '@type': 'Country', name: 'Finland' } },
    { '@type': 'City', name: 'Vienna', containedInPlace: { '@type': 'Country', name: 'Austria' } },
    { '@type': 'City', name: 'Prague', containedInPlace: { '@type': 'Country', name: 'Czech Republic' } },
    { '@type': 'City', name: 'Warsaw', containedInPlace: { '@type': 'Country', name: 'Poland' } },
    { '@type': 'City', name: 'Budapest', containedInPlace: { '@type': 'Country', name: 'Hungary' } },
    { '@type': 'City', name: 'Lisbon', containedInPlace: { '@type': 'Country', name: 'Portugal' } },
    { '@type': 'City', name: 'Dublin', containedInPlace: { '@type': 'Country', name: 'Ireland' } },
    { '@type': 'City', name: 'Munich', containedInPlace: { '@type': 'Country', name: 'Germany' } },
    // Spanish-speaking
    { '@type': 'City', name: 'Mexico City', containedInPlace: { '@type': 'Country', name: 'Mexico' } },
    { '@type': 'City', name: 'Guadalajara', containedInPlace: { '@type': 'Country', name: 'Mexico' } },
    { '@type': 'City', name: 'Monterrey', containedInPlace: { '@type': 'Country', name: 'Mexico' } },
    { '@type': 'City', name: 'Buenos Aires', containedInPlace: { '@type': 'Country', name: 'Argentina' } },
    { '@type': 'City', name: 'Bogota', containedInPlace: { '@type': 'Country', name: 'Colombia' } },
    { '@type': 'City', name: 'Lima', containedInPlace: { '@type': 'Country', name: 'Peru' } },
    { '@type': 'City', name: 'Santiago', containedInPlace: { '@type': 'Country', name: 'Chile' } },
    { '@type': 'City', name: 'Caracas', containedInPlace: { '@type': 'Country', name: 'Venezuela' } },
    { '@type': 'City', name: 'San Jose', containedInPlace: { '@type': 'Country', name: 'Costa Rica' } },
    { '@type': 'City', name: 'Panama City', containedInPlace: { '@type': 'Country', name: 'Panama' } },
    // Russian-speaking
    { '@type': 'City', name: 'Moscow', containedInPlace: { '@type': 'Country', name: 'Russia' } },
    { '@type': 'City', name: 'Saint Petersburg', containedInPlace: { '@type': 'Country', name: 'Russia' } },
    { '@type': 'City', name: 'Kyiv', containedInPlace: { '@type': 'Country', name: 'Ukraine' } },
    { '@type': 'City', name: 'Minsk', containedInPlace: { '@type': 'Country', name: 'Belarus' } },
    { '@type': 'City', name: 'Almaty', containedInPlace: { '@type': 'Country', name: 'Kazakhstan' } },
    { '@type': 'City', name: 'Tashkent', containedInPlace: { '@type': 'Country', name: 'Uzbekistan' } },
    // Swahili-speaking East Africa
    { '@type': 'City', name: 'Nairobi', containedInPlace: { '@type': 'Country', name: 'Kenya' } },
    { '@type': 'City', name: 'Mombasa', containedInPlace: { '@type': 'Country', name: 'Kenya' } },
    { '@type': 'City', name: 'Dar es Salaam', containedInPlace: { '@type': 'Country', name: 'Tanzania' } },
    { '@type': 'City', name: 'Arusha', containedInPlace: { '@type': 'Country', name: 'Tanzania' } },
    { '@type': 'City', name: 'Kampala', containedInPlace: { '@type': 'Country', name: 'Uganda' } },
    { '@type': 'City', name: 'Kigali', containedInPlace: { '@type': 'Country', name: 'Rwanda' } },
    { '@type': 'City', name: 'Kinshasa', containedInPlace: { '@type': 'Country', name: 'DRC' } },
  ],
  knowsAbout: [
    'React',
    'Next.js',
    'Node.js',
    'Python',
    'AWS',
    'AI Prompt Engineering',
    'Full Stack Web Development',
    'UI/UX Design',
    'Salesforce',
    'PostgreSQL',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Certified Solutions Architect',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certified Salesforce Administrator',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Full-Stack Web Development Bootcamp Certification',
      credentialCategory: 'certification',
    },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* ── JSON-LD ── */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">
        {/* ── GTM noscript fallback ── */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5C2QMZDQ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <LangProvider>{children}</LangProvider>

        {/* ── Google Tag Manager — fires on every page ── */}
        <Script
          id="gtm-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5C2QMZDQ');`,
          }}
        />
        {/* ── Google Analytics GA4 — fires on every page ── */}
        <Script
          id="ga4-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-GC9CLZ5PT4"
          strategy="afterInteractive"
        />
        <Script
          id="ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GC9CLZ5PT4',{send_page_view:true});`,
          }}
        />
        {/* ── Google Analytics GA4 — hire-papy (G-PSL7H6QDRM) ── */}
        <Script
          id="hire-papy-ga4-src"
          src="https://www.googletagmanager.com/gtag/js?id=G-PSL7H6QDRM"
          strategy="afterInteractive"
        />
        <Script
          id="hire-papy-ga4-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-PSL7H6QDRM',{send_page_view:true});`,
          }}
        />
      </body>
    </html>
  )
}
