const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://crow.up.railway.app'

export const metadata = {
  title: 'CROW News | Dripping Springs, TX — Local Independent Newspaper',
  description:
    'CROW News covers Dripping Springs, Texas with authentic local journalism. Breaking news, community events, schools, city council, and investigative reporting for Dripping Springs and the Hill Country.',
  keywords: [
    'Dripping Springs news',
    'Dripping Springs Texas newspaper',
    'CROW News Dripping Springs',
    'Dripping Springs TX local news',
    'Hill Country news',
    'Dripping Springs community',
    'Dripping Springs city council',
    'Dripping Springs schools',
    'Dripping Springs events',
    'Hays County news',
    'Wimberley news',
    'Bee Cave news',
    'Spicewood news',
    'Driftwood Texas news',
    'local Texas newspaper',
    'independent news Texas',
    'CROW newspaper',
  ],
  alternates: { canonical: '/crow' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/crow`,
    title: 'CROW News — Dripping Springs, TX',
    description: 'Your local independent newspaper for Dripping Springs, Texas and the Hill Country.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CROW News — Dripping Springs, TX',
    description: 'Local independent newspaper for Dripping Springs, Texas.',
    images: ['/og-image.png'],
  },
}

export default function CrowLayout({ children }) {
  return children
}

