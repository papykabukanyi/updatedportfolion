'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/pkvault/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background grid */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-purple-900/25 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-900/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-violet-950/20 blur-[180px] pointer-events-none" />

      {/* Floating dots */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(18)].map((_, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-cyan-400"
              style={{
                top: `${((Math.sin(i * 2.4) + 1) / 2) * 90 + 5}%`,
                left: `${((Math.cos(i * 2.4) + 1) / 2) * 90 + 5}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
                opacity: 0.08 + (i % 4) * 0.05,
                animation: `pkfloat ${5 + (i % 6)}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Card */}
      <div
        className="relative w-full max-w-[400px]"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
          transition: 'opacity 0.5s cubic-bezier(0.4,0,0.2,1), transform 0.5s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Gradient border glow */}
        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500/40 via-violet-600/10 to-cyan-500/20 pointer-events-none" />

        <div className="relative bg-[#080b14]/95 backdrop-blur-2xl rounded-2xl p-8">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-[72px] h-[72px] mb-4">
              {/* Ring glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-700 blur-md opacity-60" />
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center shadow-xl">
                <span className="text-white font-black text-2xl tracking-tighter select-none">PK</span>
              </div>
            </div>
            <h1 className="text-[26px] font-black text-white tracking-tight leading-none">PK Vault</h1>
            <p className="text-gray-500 text-xs mt-1.5 tracking-[0.2em] uppercase">Central Admin Panel</p>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
            <span className="text-gray-600 text-[10px] tracking-[0.2em] uppercase font-medium">Secure Access</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-[0.18em] mb-2 font-semibold">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoFocus
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3.5 pr-12 text-white placeholder-gray-700 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.06] transition-all text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors min-h-0 p-1"
                  tabIndex={-1}
                >
                  {show ? (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-red-400 shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="relative w-full overflow-hidden rounded-xl py-3.5 font-bold text-sm text-white shadow-lg shadow-purple-900/30 transition-all hover:shadow-purple-800/50 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 active:scale-[0.99] group"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    Enter PK Vault
                  </>
                )}
              </span>
              {/* Shimmer on hover */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            </button>
          </form>

          <p className="text-center text-gray-700 text-[11px] mt-6 tracking-wider">
            Portfolio · CROW News · Papi&apos;s Store
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pkfloat {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-18px) }
        }
      `}</style>
    </div>
  )
}
