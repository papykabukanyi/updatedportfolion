'use client'
import { useState, useEffect } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { useLang } from '@/lib/LangContext'

const navHrefs = ['#about', '#experience', '#skills', '#certifications', '#github', '#contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  const navKeys = ['about', 'experience', 'skills', 'certifications', 'github', 'contact']
  const navLinks = navKeys.map((key, i) => ({ name: t.nav[key], href: navHrefs[i] }))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#050508]/90 backdrop-blur-md border-b border-white/5 py-3'
          : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="text-xl font-bold font-mono gradient-text tracking-tight">
          PK<span className="text-white">.</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              {link.name}
            </a>
          ))}
          {/* Language toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono font-bold text-slate-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-200"
            aria-label="Toggle language"
          >
            <span className={lang === 'en' ? 'text-cyan-400' : 'text-slate-500'}>EN</span>
            <span className="text-white/20">|</span>
            <span className={lang === 'fr' ? 'text-cyan-400' : 'text-slate-500'}>FR</span>
          </button>
          <a
            href="/resume.pdf"
            download="Papy_Kabukanyi_Resume.pdf"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-sm font-semibold hover:bg-cyan-500/15 hover:border-cyan-500/60 transition-all duration-200"
          >
            <FiDownload size={13} />
            {t.nav.resume}
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#050508]/95 backdrop-blur-md border-b border-white/5 px-6 py-5 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center justify-between pt-2">
            <a
              href="/resume.pdf"
              download="Papy_Kabukanyi_Resume.pdf"
              className="flex items-center gap-2 text-cyan-400 font-semibold"
            >
              <FiDownload size={14} /> {t.nav.resume}
            </a>
            <button
              onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-mono font-bold text-slate-300"
              aria-label="Toggle language"
            >
              <span className={lang === 'en' ? 'text-cyan-400' : 'text-slate-500'}>EN</span>
              <span className="text-white/20">|</span>
              <span className={lang === 'fr' ? 'text-cyan-400' : 'text-slate-500'}>FR</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
