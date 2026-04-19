import { Inter, Oswald } from 'next/font/google'
import './globals.css'
import { LangProvider } from '@/lib/LangContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald', weight: ['400', '500', '600', '700'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papy-construction-demolition.up.railway.app'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Papy Construction & Demolition | Licensed Contractor — Austin, TX | Serving TX, OK, LA, AR, NM, AZ & Beyond',
    template: '%s | Papy Construction & Demolition | Austin TX',
  },
  description:
    'Papy Construction & Demolition — Austin TX licensed general contractor. Residential & commercial demolition, site clearing, interior demo, concrete breaking & debris removal. Serving all of Texas, Oklahoma, Louisiana, Arkansas, New Mexico, Arizona, Colorado and surrounding states within 1,000 miles of Austin. Call for a FREE estimate!',
  keywords: [
    // ── Brand
    'Papy Construction','Papy Demolition','Papy Construction and Demolition','Papy C&D',
    'Papy C&D Austin','papykabukanyi demolition','papy contractor Austin TX',
    // ── Austin Metro
    'demolition contractor Austin TX','construction company Austin TX',
    'residential demolition Austin TX','commercial demolition Austin TX',
    'interior demolition Austin TX','house demolition Austin TX',
    'site clearing Austin TX','land clearing Austin TX','concrete breaking Austin TX',
    'debris removal Austin TX','pool demolition Austin TX','garage demolition Austin TX',
    'slab demolition Austin TX','building demolition Austin TX','wall removal Austin TX',
    'free demolition estimate Austin TX','affordable demolition Austin TX',
    'licensed demolition contractor Austin TX','insured demolition contractor Austin TX',
    'new construction Austin TX','general contractor Austin TX','renovation contractor Austin TX',
    // ── Austin Suburbs (within 50 mi)
    'demolition contractor Cedar Park TX','demolition Cedar Park TX',
    'demolition contractor Round Rock TX','demolition Round Rock TX',
    'demolition contractor Georgetown TX','demolition Georgetown TX',
    'demolition contractor Pflugerville TX','demolition Pflugerville TX',
    'demolition contractor Leander TX','demolition Leander TX',
    'demolition contractor Kyle TX','demolition Kyle TX',
    'demolition contractor Buda TX','demolition Buda TX',
    'demolition contractor San Marcos TX','demolition San Marcos TX',
    'demolition contractor Wimberley TX','demolition Dripping Springs TX',
    'demolition contractor Bee Cave TX','demolition contractor Lakeway TX',
    'demolition contractor Bastrop TX','demolition contractor Elgin TX',
    'demolition contractor Taylor TX','demolition contractor Hutto TX',
    'demolition contractor Liberty Hill TX','demolition contractor Manor TX',
    'demolition contractor New Braunfels TX','demolition New Braunfels TX',
    'demolition contractor Seguin TX','demolition contractor Lockhart TX',
    // ── San Antonio (80 mi)
    'demolition contractor San Antonio TX','demolition San Antonio TX',
    'commercial demolition San Antonio TX','residential demolition San Antonio TX',
    'site clearing San Antonio TX','concrete breaking San Antonio TX',
    'demolition contractor Boerne TX','demolition contractor Helotes TX',
    'demolition contractor Schertz TX','demolition contractor Converse TX',
    'demolition contractor Universal City TX','demolition contractor Live Oak TX',
    // ── Waco / Temple / Killeen (100–120 mi)
    'demolition contractor Waco TX','demolition Waco TX',
    'demolition contractor Temple TX','demolition contractor Killeen TX',
    'demolition contractor Belton TX','demolition contractor Harker Heights TX',
    'demolition contractor College Station TX','demolition Bryan TX',
    // ── Houston Metro (165 mi)
    'demolition contractor Houston TX','demolition Houston TX',
    'commercial demolition Houston TX','residential demolition Houston TX',
    'site clearing Houston TX','land clearing Houston TX',
    'demolition contractor Sugar Land TX','demolition contractor Katy TX',
    'demolition contractor The Woodlands TX','demolition contractor Conroe TX',
    'demolition contractor Pearland TX','demolition contractor League City TX',
    'demolition contractor Baytown TX','demolition contractor Pasadena TX',
    'demolition contractor Spring TX','demolition contractor Cypress TX',
    'demolition contractor Galveston TX',
    // ── Dallas / Fort Worth (195 mi)
    'demolition contractor Dallas TX','demolition Dallas TX',
    'commercial demolition Dallas TX','residential demolition Dallas TX',
    'demolition contractor Fort Worth TX','demolition Fort Worth TX',
    'demolition contractor Arlington TX','demolition contractor Plano TX',
    'demolition contractor Irving TX','demolition contractor Garland TX',
    'demolition contractor Frisco TX','demolition contractor McKinney TX',
    'demolition contractor Denton TX','demolition contractor Carrollton TX',
    'demolition contractor Richardson TX','demolition contractor Mesquite TX',
    'demolition contractor Grand Prairie TX','demolition contractor Mansfield TX',
    'demolition contractor Lewisville TX','demolition contractor Allen TX',
    // ── South & East Texas
    'demolition contractor Corpus Christi TX','demolition Corpus Christi TX',
    'demolition contractor Victoria TX','demolition contractor Laredo TX',
    'demolition contractor McAllen TX','demolition contractor Harlingen TX',
    'demolition contractor Brownsville TX','demolition contractor Beaumont TX',
    'demolition contractor Port Arthur TX','demolition contractor Tyler TX',
    'demolition contractor Longview TX','demolition contractor Texarkana TX',
    'demolition contractor Wichita Falls TX',
    // ── West & Panhandle Texas
    'demolition contractor Abilene TX','demolition contractor Lubbock TX',
    'demolition contractor Amarillo TX','demolition contractor Midland TX',
    'demolition contractor Odessa TX','demolition contractor San Angelo TX',
    'demolition contractor El Paso TX','demolition contractor Lufkin TX',
    // ── Oklahoma (300–500 mi)
    'demolition contractor Oklahoma City OK','demolition Oklahoma City',
    'demolition contractor Tulsa OK','demolition Tulsa Oklahoma',
    'demolition contractor Norman OK','demolition contractor Lawton OK',
    'demolition contractor Edmond OK','demolition contractor Broken Arrow OK',
    'demolition contractor Stillwater OK','demolition contractor Enid OK',
    'demolition contractor Midwest City OK','demolition contractor Moore OK',
    // ── Louisiana (250–500 mi)
    'demolition contractor Shreveport LA','demolition Shreveport Louisiana',
    'demolition contractor Bossier City LA','demolition contractor New Orleans LA',
    'demolition contractor Baton Rouge LA','demolition contractor Lafayette LA',
    'demolition contractor Lake Charles LA','demolition contractor Monroe LA',
    'demolition contractor Alexandria LA','demolition contractor Metairie LA',
    // ── Arkansas (400–600 mi)
    'demolition contractor Little Rock AR','demolition Little Rock Arkansas',
    'demolition contractor Fort Smith AR','demolition contractor Fayetteville AR',
    'demolition contractor Springdale AR','demolition contractor Rogers AR',
    'demolition contractor Jonesboro AR','demolition contractor Texarkana AR',
    // ── Mississippi (450–600 mi)
    'demolition contractor Jackson MS','demolition contractor Biloxi MS',
    'demolition contractor Gulfport MS','demolition contractor Hattiesburg MS',
    'demolition contractor Southaven MS',
    // ── Alabama (650–800 mi)
    'demolition contractor Mobile AL','demolition contractor Montgomery AL',
    'demolition contractor Birmingham AL','demolition contractor Huntsville AL',
    'demolition contractor Tuscaloosa AL','demolition contractor Dothan AL',
    // ── Tennessee (700–950 mi)
    'demolition contractor Memphis TN','demolition Memphis Tennessee',
    'demolition contractor Nashville TN','demolition contractor Chattanooga TN',
    // ── Georgia (900 mi)
    'demolition contractor Atlanta GA','demolition Atlanta Georgia',
    // ── Florida Panhandle & NE Florida (680–970 mi)
    'demolition contractor Pensacola FL','demolition contractor Panama City FL',
    'demolition contractor Tallahassee FL','demolition contractor Jacksonville FL',
    // ── New Mexico (450–650 mi)
    'demolition contractor Albuquerque NM','demolition Albuquerque New Mexico',
    'demolition contractor Santa Fe NM','demolition contractor Las Cruces NM',
    'demolition contractor Roswell NM','demolition contractor Carlsbad NM',
    'demolition contractor Hobbs NM','demolition contractor Clovis NM',
    // ── Arizona (750–950 mi)
    'demolition contractor Phoenix AZ','demolition Phoenix Arizona',
    'demolition contractor Tucson AZ','demolition contractor Mesa AZ',
    'demolition contractor Scottsdale AZ','demolition contractor Tempe AZ',
    'demolition contractor Chandler AZ','demolition contractor Flagstaff AZ',
    'demolition contractor Gilbert AZ','demolition contractor Glendale AZ',
    // ── Colorado (850–950 mi)
    'demolition contractor Denver CO','demolition Denver Colorado',
    'demolition contractor Colorado Springs CO','demolition contractor Pueblo CO',
    'demolition contractor Fort Collins CO',
    // ── Kansas (500–780 mi)
    'demolition contractor Wichita KS','demolition contractor Kansas City KS',
    // ── Missouri (600–900 mi)
    'demolition contractor Kansas City MO','demolition contractor Springfield MO',
    'demolition contractor Joplin MO',
    // ── Nebraska (960 mi)
    'demolition contractor Omaha NE','demolition contractor Lincoln NE',
    // ── Service type keywords (state-level)
    'residential demolition Texas','commercial demolition Texas',
    'demolition contractor Texas','licensed demolition contractor Texas',
    'site clearing Texas','land clearing Texas','concrete demolition Texas',
    'debris removal Texas','interior demolition Texas',
    'demolition company near me','demolition contractor near me',
    'free demolition estimate','affordable demolition contractor',
    'fast demolition services','same day demolition estimate',
  ],
  authors: [{ name: 'Papy Construction & Demolition', url: SITE_URL }],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Papy Construction & Demolition',
    title: 'Papy Construction & Demolition | Austin TX Licensed Contractor — Serving 1,000 Miles',
    description: 'Licensed demolition & construction contractor based in Austin TX. Residential & commercial demolition, site clearing, concrete breaking, debris removal. Serving Texas and surrounding states. FREE estimates!',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Papy Construction & Demolition | Austin TX — Serving TX, OK, LA, NM, AZ & More',
    description: 'Licensed demolition & construction contractor in Austin TX. Serving all of Texas and surrounding states. FREE estimates!',
  },
  other: {
    'geo.region': 'US-TX',
    'geo.placename': 'Austin, Texas',
    'geo.position': '30.2672;-97.7431',
    'ICBM': '30.2672, -97.7431',
  },
}

export const viewport = {
  width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#0a0c10',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'GeneralContractor',
  name: 'Papy Construction & Demolition',
  alternateName: ['Papy C&D', 'Papy Demolition', 'Papy Construction'],
  description: 'Licensed and insured demolition and construction contractor based in Austin, TX. Serving all of Texas, Oklahoma, Louisiana, Arkansas, New Mexico, Arizona, Colorado and surrounding states within 1,000 miles. Specializing in residential demolition, commercial demolition, interior demolition, site clearing, concrete breaking, and debris removal.',
  url: SITE_URL,
  telephone: '+15128675309',
  email: 'papykabukanyi@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Austin',
    addressRegion: 'TX',
    postalCode: '78701',
    addressCountry: 'US',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 30.2672, longitude: -97.7431 },
  areaServed: [
    // Texas — Austin Metro
    { '@type': 'City', name: 'Austin', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Cedar Park', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Round Rock', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Georgetown', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Pflugerville', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Leander', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Kyle', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Buda', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'San Marcos', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Dripping Springs', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Bastrop', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Lockhart', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Taylor', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Hutto', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Liberty Hill', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Wimberley', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Bee Cave', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Lakeway', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Texas — San Antonio
    { '@type': 'City', name: 'San Antonio', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'New Braunfels', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Seguin', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Boerne', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Schertz', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Texas — Waco / Temple / Killeen
    { '@type': 'City', name: 'Waco', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Temple', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Killeen', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'College Station', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Texas — Houston
    { '@type': 'City', name: 'Houston', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Sugar Land', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Katy', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'The Woodlands', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Pearland', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Conroe', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'League City', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Galveston', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Texas — Dallas / Fort Worth
    { '@type': 'City', name: 'Dallas', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Fort Worth', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Arlington', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Plano', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Irving', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Frisco', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'McKinney', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Denton', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Texas — Other
    { '@type': 'City', name: 'Corpus Christi', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Lubbock', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Amarillo', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Abilene', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'El Paso', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Laredo', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'McAllen', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Beaumont', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Tyler', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Wichita Falls', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Midland', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Odessa', containedInPlace: { '@type': 'State', name: 'Texas' } },
    { '@type': 'City', name: 'Texarkana', containedInPlace: { '@type': 'State', name: 'Texas' } },
    // Oklahoma
    { '@type': 'City', name: 'Oklahoma City', containedInPlace: { '@type': 'State', name: 'Oklahoma' } },
    { '@type': 'City', name: 'Tulsa', containedInPlace: { '@type': 'State', name: 'Oklahoma' } },
    { '@type': 'City', name: 'Norman', containedInPlace: { '@type': 'State', name: 'Oklahoma' } },
    { '@type': 'City', name: 'Lawton', containedInPlace: { '@type': 'State', name: 'Oklahoma' } },
    { '@type': 'City', name: 'Edmond', containedInPlace: { '@type': 'State', name: 'Oklahoma' } },
    // Louisiana
    { '@type': 'City', name: 'Shreveport', containedInPlace: { '@type': 'State', name: 'Louisiana' } },
    { '@type': 'City', name: 'New Orleans', containedInPlace: { '@type': 'State', name: 'Louisiana' } },
    { '@type': 'City', name: 'Baton Rouge', containedInPlace: { '@type': 'State', name: 'Louisiana' } },
    { '@type': 'City', name: 'Lafayette', containedInPlace: { '@type': 'State', name: 'Louisiana' } },
    { '@type': 'City', name: 'Lake Charles', containedInPlace: { '@type': 'State', name: 'Louisiana' } },
    // Arkansas
    { '@type': 'City', name: 'Little Rock', containedInPlace: { '@type': 'State', name: 'Arkansas' } },
    { '@type': 'City', name: 'Fort Smith', containedInPlace: { '@type': 'State', name: 'Arkansas' } },
    { '@type': 'City', name: 'Fayetteville', containedInPlace: { '@type': 'State', name: 'Arkansas' } },
    // Mississippi
    { '@type': 'City', name: 'Jackson', containedInPlace: { '@type': 'State', name: 'Mississippi' } },
    { '@type': 'City', name: 'Biloxi', containedInPlace: { '@type': 'State', name: 'Mississippi' } },
    { '@type': 'City', name: 'Gulfport', containedInPlace: { '@type': 'State', name: 'Mississippi' } },
    // Alabama
    { '@type': 'City', name: 'Mobile', containedInPlace: { '@type': 'State', name: 'Alabama' } },
    { '@type': 'City', name: 'Montgomery', containedInPlace: { '@type': 'State', name: 'Alabama' } },
    { '@type': 'City', name: 'Birmingham', containedInPlace: { '@type': 'State', name: 'Alabama' } },
    { '@type': 'City', name: 'Huntsville', containedInPlace: { '@type': 'State', name: 'Alabama' } },
    // Tennessee
    { '@type': 'City', name: 'Memphis', containedInPlace: { '@type': 'State', name: 'Tennessee' } },
    { '@type': 'City', name: 'Nashville', containedInPlace: { '@type': 'State', name: 'Tennessee' } },
    // Georgia
    { '@type': 'City', name: 'Atlanta', containedInPlace: { '@type': 'State', name: 'Georgia' } },
    // Florida
    { '@type': 'City', name: 'Pensacola', containedInPlace: { '@type': 'State', name: 'Florida' } },
    { '@type': 'City', name: 'Tallahassee', containedInPlace: { '@type': 'State', name: 'Florida' } },
    { '@type': 'City', name: 'Jacksonville', containedInPlace: { '@type': 'State', name: 'Florida' } },
    // New Mexico
    { '@type': 'City', name: 'Albuquerque', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    { '@type': 'City', name: 'Santa Fe', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    { '@type': 'City', name: 'Las Cruces', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    { '@type': 'City', name: 'Roswell', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    { '@type': 'City', name: 'Carlsbad', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    { '@type': 'City', name: 'Hobbs', containedInPlace: { '@type': 'State', name: 'New Mexico' } },
    // Arizona
    { '@type': 'City', name: 'Phoenix', containedInPlace: { '@type': 'State', name: 'Arizona' } },
    { '@type': 'City', name: 'Tucson', containedInPlace: { '@type': 'State', name: 'Arizona' } },
    { '@type': 'City', name: 'Mesa', containedInPlace: { '@type': 'State', name: 'Arizona' } },
    { '@type': 'City', name: 'Scottsdale', containedInPlace: { '@type': 'State', name: 'Arizona' } },
    { '@type': 'City', name: 'Flagstaff', containedInPlace: { '@type': 'State', name: 'Arizona' } },
    // Colorado
    { '@type': 'City', name: 'Denver', containedInPlace: { '@type': 'State', name: 'Colorado' } },
    { '@type': 'City', name: 'Colorado Springs', containedInPlace: { '@type': 'State', name: 'Colorado' } },
    { '@type': 'City', name: 'Pueblo', containedInPlace: { '@type': 'State', name: 'Colorado' } },
    // Kansas
    { '@type': 'City', name: 'Wichita', containedInPlace: { '@type': 'State', name: 'Kansas' } },
    // Missouri
    { '@type': 'City', name: 'Kansas City', containedInPlace: { '@type': 'State', name: 'Missouri' } },
    { '@type': 'City', name: 'Springfield', containedInPlace: { '@type': 'State', name: 'Missouri' } },
    { '@type': 'City', name: 'Joplin', containedInPlace: { '@type': 'State', name: 'Missouri' } },
  ],
  serviceType: [
    'Residential Demolition',
    'Commercial Demolition',
    'Interior Demolition',
    'Site Clearing & Grading',
    'Concrete Breaking & Removal',
    'Debris Removal & Hauling',
    'Land Clearing',
    'Pool Demolition',
    'Garage Demolition',
    'Building Demolition',
    'Selective Demolition',
    'General Contracting',
    'Renovation',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Demolition & Construction Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Residential Demolition', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Commercial Demolition', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Interior Demolition', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Site Clearing & Grading', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Concrete Breaking & Removal', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Debris Removal & Hauling', areaServed: 'Austin, TX and surrounding 1,000 miles' } },
    ],
  },
  priceRange: '$$',
  openingHours: 'Mo-Sa 07:00-18:00',
  sameAs: [SITE_URL],
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