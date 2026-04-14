const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://papykabukanyi.up.railway.app'

export const metadata = {
  title: 'Resume',
  description:
    'Resume of Papy Kabukanyi — Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Expert in React, Next.js, Node.js, Python, AWS, and LLM integration. Available for full-time, contract, and remote opportunities.',
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
    type: 'profile',
    url: `${SITE_URL}/resume`,
    title: 'Resume — Papy Kabukanyi | Web Developer & AI Prompt Engineer',
    description:
      'Full-Stack Web Developer and AI Prompt Engineer. React, Node.js, Python, AWS, LLM integration. Based in Austin, TX. Open to hire.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Papy Kabukanyi Resume',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume — Papy Kabukanyi | Web Developer & AI Prompt Engineer',
    description:
      'Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Available for hire.',
    images: ['/og-image.png'],
    creator: '@papykabukanyi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
    },
  },
}

export default function ResumeLayout({ children }) {
  return children
}
