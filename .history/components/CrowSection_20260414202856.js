'use client'
import CrowLogo from './CrowLogo'

const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || '/crow'

export default function CrowSection() {
  return (
    <section className="py-20 px-4 bg-[#07070f] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <CrowLogo size={48} className="text-white" />
          <div>
            <h2 className="text-3xl font-black tracking-tight text-white font-serif">CROW News</h2>
            <p className="text-slate-400 text-sm mt-0.5">Dripping Springs, Texas — Local. Independent. Fearless.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Blurb */}
          <div>
            <p className="text-slate-300 leading-relaxed mb-6">
              CROW News is an independent digital newspaper covering Dripping Springs, TX — and growing to cities everywhere.
              Get hyperlocal stories, community events, and investigative reporting delivered straight to your inbox.
            </p>
            <a
              href={CROW_URL}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              Read Latest News &rarr;
            </a>
          </div>

          {/* CTA card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">🗞️</div>
            <h3 className="text-white font-bold text-xl mb-2">Stay Informed</h3>
            <p className="text-slate-400 text-sm mb-5">
              Subscribe for free — local stories, zero spam, unsubscribe anytime.
            </p>
            <a
              href={CROW_URL}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-500 transition-colors"
            >
              Subscribe on CROW News &rarr;
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
