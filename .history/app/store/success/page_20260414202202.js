'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    if (sessionId) {
      setStatus('ok')
    } else {
      setStatus('error')
    }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-10 text-center">
        {status === 'loading' && (
          <div className="text-gray-500">Loading your order...</div>
        )}
        {status === 'ok' && (
          <>
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-black text-amber-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600 mb-2">
              Thank you for your order from <strong>Papi's Store</strong>!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              You'll receive a confirmation email with tracking info once your order ships.
              All shirts are printed and shipped within 3–5 business days.
            </p>
            <div className="space-y-3">
              <Link href="/store" className="block w-full bg-amber-900 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition-colors">
                ← Back to Store
              </Link>
              <Link href="/" className="block w-full border border-gray-300 text-gray-700 font-medium py-3 rounded-lg hover:border-amber-700 transition-colors">
                Back to Portfolio
              </Link>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">We couldn't verify your order. If you were charged, please contact us.</p>
            <Link href="/store" className="inline-block bg-amber-900 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors">
              Return to Store
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
