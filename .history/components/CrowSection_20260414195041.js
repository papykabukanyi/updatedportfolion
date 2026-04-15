'use client'
import { useState } from 'react'
import CrowLogo from './CrowLogo'

export default function CrowSection() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState(null) // null | 'loading' | 'ok' | 'err'

  async function handleSubscribe(e) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/crow/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, city: 'dripping-springs' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error')
      setStatus('ok')
    } catch (err) {
      setStatus('err')
    }
  }

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

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Blurb */}
          <div>
            <p className="text-slate-300 leading-relaxed mb-4">
              CROW News is an independent digital newspaper covering Dripping Springs, TX — and growing to cities everywhere.
              Get hyperlocal stories, community events, and investigative reporting delivered straight to your inbox.
            </p>
            <a
              href="/crow"
              className="inline-block mt-2 px-5 py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-slate-100 transition-colors"
            >
              Read Latest News &rarr;
            </a>
          </div>

          {/* Subscribe form */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-white font-bold text-lg mb-1">Subscribe Free</h3>
            <p className="text-slate-400 text-sm mb-4">Stay informed. No spam. Unsubscribe anytime.</p>

            {status === 'ok' ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-white font-semibold">You&apos;re subscribed!</p>
                <p className="text-slate-400 text-sm mt-1">Welcome to the CROW community.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30"
                />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-white/30"
                />
                {status === 'err' && (
                  <p className="text-red-400 text-xs">Something went wrong. Try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-bold hover:bg-slate-100 transition-colors disabled:opacity-60"
                >
                  {status === 'loading' ? 'Subscribing...' : 'Subscribe to CROW News'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
