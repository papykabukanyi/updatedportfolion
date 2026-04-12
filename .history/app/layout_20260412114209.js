import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papykabukanyi.up.railway.app'

export const metadata = {
  // ─── Core ────────────────────────────────────────────────────────────────
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer — Austin, TX',
    template: '%s | Papy Kabukanyi',
  },
  description:
    'Papy Kabukanyi is a Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Specializing in React, Next.js, Node.js, Python, AWS cloud architecture, and LLM integration. Available for hire.',
  keywords: [
    'web developer Austin TX',
    'full stack developer',
    'AI prompt engineer',
    'React developer',
    'Next.js developer',
    'Node.js developer',
    'Python developer',
    'AWS solutions architect',
    'Papy Kabukanyi',
    'papykabukanyi',
    'freelance web developer',
    'LLM integration',
    'UI UX designer',
    'Salesforce administrator',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
