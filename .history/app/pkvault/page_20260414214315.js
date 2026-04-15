'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import CrowLogo from '@/components/CrowLogo'

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
      router.push('/pkvault/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-sm p-8 shadow-2xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <CrowLogo size={32} className="text-purple-400" />
          <span className="text-white font-black text-xl tracking-wide">PK Vault</span>
        </div>
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
            {loading ? 'Entering...' : 'Enter'}
          </button>
        </form>
      </div>
    </div>
  )
}
