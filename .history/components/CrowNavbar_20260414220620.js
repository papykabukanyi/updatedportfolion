'use client'
import CrowLogo from './CrowLogo'

export default function CrowNavbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center">
        <a href="/crow" className="flex items-center gap-2.5 no-underline">
          <CrowLogo size={28} className="text-white" />
          <span className="text-white font-black text-lg tracking-tight font-serif">CROW News</span>
        </a>
      </div>
    </nav>
  )
}

