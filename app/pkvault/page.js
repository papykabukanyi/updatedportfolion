'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CrowLogo from '@/components/CrowLogo'

const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://hire-papy.up.railway.app'
const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || 'https://crow.up.railway.app'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://papys-store.up.railway.app'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
      router.push('/pkvault/crow')
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CrowLogo size={32} className="text-purple-400" />
          <span className="text-white font-black text-xl tracking-wide">PK Vault</span>
        </div>
        <p className="text-center text-gray-500 text-xs mb-6 tracking-widest uppercase">Central Admin</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1 tracking-widest uppercase">Admin Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg transition-colors">
            {loading ? 'Entering...' : 'Enter Vault'}
          </button>
        </form>
      </div>
      <div className="mt-6 flex items-center gap-4 text-xs text-gray-600">
        <a href={PORTFOLIO_URL} className="hover:text-gray-400 transition-colors">Portfolio</a>
        <span>·</span>
        <a href={CROW_URL} className="hover:text-purple-400 transition-colors">CROW News</a>
        <span>·</span>
        <a href={STORE_URL} className="hover:text-amber-400 transition-colors">Papi&apos;s Store</a>
      </div>
    </div>
  )
}

