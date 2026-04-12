import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})

export const metadata = {
  title: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer',
  description:
    'Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX. Expert in React, Node.js, Python, AWS and digital marketing.',
  keywords:
    'web developer, AI prompt engineer, full stack, React, Node.js, Python, AWS, Austin TX, Papy Kabukanyi',
  openGraph: {
    title: 'Papy Kabukanyi | Web Developer & AI Prompt Engineer',
    description: 'Full-Stack Web Developer and AI Prompt Engineer based in Austin, TX.',
    type: 'website',
    url: 'https://papykabukanyi.up.railway.app',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#050508',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
