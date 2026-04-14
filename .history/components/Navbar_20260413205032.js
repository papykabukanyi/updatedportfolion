'use client'
import { useState, useEffect } from 'react'
import { FiDownload, FiMenu, FiX } from 'react-icons/fi'
import { useLang } from '@/lib/LangContext'

const navIds = ['about', 'experience', 'skills', 'certifications', 'github', 'contact']

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { lang, setLang, t } = useLang()

  const navLinks = navIds.map((id) => ({ name: t.nav[id], id }))

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
        <button onClick={() => scrollTo('hero')} className="text-xl font-bold font-mono gradient-text tracking-tight">
          PK<span className="text-white">.</span>
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollTo(link.id)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              {link.name}
            </button>
          ))}
          {/* Language select */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-white/10 bg-[#0d0d18] text-xs font-mono font-bold text-cyan-400 cursor-pointer focus:outline-none hover:border-cyan-500/40 transition-all duration-200"
            aria-label="Select language"
          >
            <option value="en">EN</option>
            <option value="fr">FR</option>
            <option value="es">ES</option>
            <option value="ru">RU</option>
            <option value="sw">SW</option>
          </select>
          <a
            href="/resume"
            target="_blank"
            rel="noopener noreferrer"
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
            <button
              key={link.name}
              onClick={() => { scrollTo(link.id); setMobileOpen(false) }}
              className="block w-full text-left text-slate-400 hover:text-cyan-400 transition-colors font-medium"
            >
              {link.name}
            </button>
          ))}
          <div className="flex items-center justify-between pt-2">
            <a
              href="/resume"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-cyan-400 font-semibold"
            >
              <FiDownload size={14} /> {t.nav.resume}
            </a>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="px-2 py-1.5 rounded-lg border border-white/10 bg-[#0d0d18] text-xs font-mono font-bold text-cyan-400 cursor-pointer focus:outline-none"
              aria-label="Select language"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="es">ES</option>
              <option value="ru">RU</option>
              <option value="sw">SW</option>
            </select>
          </div>
        </div>
      )}
    </nav>
  )
}
