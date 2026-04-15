'use client'
import { useState, useEffect } from 'react'
import { FiDownload, FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { useLang } from '@/lib/LangContext'

const navIds = ['about', 'experience', 'skills', 'certifications', 'github', 'contact']

const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || '#'
const STORE_URL = process.env.NEXT_PUBLIC_PAPYS_STORE_URL || '#'

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loading, setLoading] = useState(null) // 'crow' | 'store' | null
  const { lang, setLang, t } = useLang()

  const navLinks = navIds.map((id) => ({ name: t.nav[id], id }))

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function navigate(key, url) {
    setLoading(key)
    setMobileOpen(false)
    setTimeout(() => {
      window.location.href = url
    }, 700)
  }

  return (
    <>
      {/* Full-screen loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-[#050508] flex flex-col items-center justify-center gap-6">
          <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-cyan-400 animate-spin" />
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
            {loading === 'crow' ? 'Loading CROW...' : "Loading Papi's Store..."}
          </p>
        </div>
      )}

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
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.id)}
                className="text-sm text-slate-400 hover:text-cyan-400 transition-colors duration-200 font-medium"
              >
                {link.name}
              </button>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-white/10" />

            {/* CROW button */}
            <button
              onClick={() => navigate('crow', CROW_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-bold hover:bg-purple-500/15 hover:border-purple-500/60 transition-all duration-200"
            >
              <FiExternalLink size={11} />
              CROW
            </button>

            {/* Papi's Store button */}
            <button
              onClick={() => navigate('store', STORE_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-bold hover:bg-amber-500/15 hover:border-amber-500/60 transition-all duration-200"
            >
              <FiExternalLink size={11} />
              PAPI&apos;S STORE
            </button>

            {/* Divider */}
            <span className="w-px h-4 bg-white/10" />

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

            {/* CROW & Store in mobile */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => navigate('crow', CROW_URL)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/5 text-purple-400 text-xs font-bold hover:bg-purple-500/15 transition-all"
              >
                <FiExternalLink size={11} /> CROW
              </button>
              <button
                onClick={() => navigate('store', STORE_URL)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-bold hover:bg-amber-500/15 transition-all"
              >
                <FiExternalLink size={11} /> PAPI&apos;S STORE
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
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
    </>
  )
}

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
