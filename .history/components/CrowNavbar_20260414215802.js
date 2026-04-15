'use client'
import { useState } from 'react'
import CrowLogo from './CrowLogo'
import { FiExternalLink, FiMenu, FiX } from 'react-icons/fi'

const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://hire-papy.up.railway.app'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://papys-store.up.railway.app'
const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL || 'https://pk-admin.up.railway.app'

export default function CrowNavbar() {
  const [loading, setLoading] = useState(null)
  const [open, setOpen] = useState(false)

  function navigate(key, url) {
    setLoading(key)
    setOpen(false)
    setTimeout(() => { window.location.href = url }, 1400)
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center">
          <div className="fixed top-0 left-0 right-0 h-[3px] bg-white/10">
            <div
              className={`h-full animate-loading-bar ${
                loading === 'store'
                  ? 'bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500'
                  : 'bg-gradient-to-r from-white via-slate-300 to-white'
              }`}
            />
          </div>
          <div className={`w-12 h-12 rounded-full border-4 border-white/10 animate-spin ${loading === 'store' ? 'border-t-amber-400' : 'border-t-white'}`} />
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase mt-6">
            {loading === 'store' ? "Loading Papi's Store…" : 'Going to Portfolio…'}
          </p>
        </div>
      )}

      <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/crow" className="flex items-center gap-2.5 no-underline">
            <CrowLogo size={28} className="text-white" />
            <span className="text-white font-black text-lg tracking-tight font-serif">CROW News</span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('portfolio', PORTFOLIO_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-slate-300 text-xs font-semibold hover:border-white/40 hover:text-white transition-all"
            >
              <FiExternalLink size={11} /> Portfolio
            </button>
            <button
              onClick={() => navigate('store', STORE_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-bold hover:bg-amber-500/15 hover:border-amber-500/60 transition-all"
            >
              <FiExternalLink size={11} /> Papi&apos;s Store
            </button>
            <button
              onClick={() => navigate('admin', ADMIN_URL)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-600/40 bg-gray-800/20 text-gray-400 text-xs font-bold hover:bg-gray-700/40 hover:border-gray-500/60 transition-all"
            >
              <FiExternalLink size={11} /> Admin
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {open ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden bg-black/95 border-t border-white/10 px-4 py-4 flex flex-col gap-3">
            <button
              onClick={() => navigate('portfolio', PORTFOLIO_URL)}
              className="flex items-center gap-2 text-slate-300 text-sm font-semibold hover:text-white transition-colors"
            >
              <FiExternalLink size={13} /> View Portfolio
            </button>
            <button
              onClick={() => navigate('store', STORE_URL)}
              className="flex items-center gap-2 text-amber-400 text-sm font-bold hover:text-amber-300 transition-colors"
            >
              <FiExternalLink size={13} /> Papi&apos;s Store
            </button>
            <button
              onClick={() => navigate('admin', ADMIN_URL)}
              className="flex items-center gap-2 text-gray-400 text-sm font-semibold hover:text-gray-300 transition-colors"
            >
              <FiExternalLink size={13} /> Admin
            </button>
          </div>
        )}
      </nav>
    </>
  )
}
