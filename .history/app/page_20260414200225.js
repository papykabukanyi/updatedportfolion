import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import Certifications from '@/components/Certifications'
import GitHubShowcase from '@/components/GitHubShowcase'
import Contact from '@/components/Contact'
import CrowSection from '@/components/CrowSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Certifications />
      <Suspense
        fallback={
          <section className="py-24 px-4 text-center text-slate-500 font-mono text-sm">
            Loading GitHub data...
          </section>
        }
      >
        <GitHubShowcase />
      </Suspense>
      <Contact />
      <CrowSection />
      <Footer />
    </main>
  )
}
