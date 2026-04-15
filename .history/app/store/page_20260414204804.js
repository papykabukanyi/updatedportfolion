'use client'
import { useState, useEffect } from 'react'
import CrowLogo from '@/components/CrowLogo'

const PORTFOLIO_URL = process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://hire-papy.up.railway.app'
const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || 'https://crow.up.railway.app'

const PLACEHOLDER_PRODUCTS = [
  {
    id: 'tee-001',
    name: 'CROW News Classic Tee',
    description: 'Soft 100% cotton unisex tee featuring the CROW News masthead design. Screenprinted in the USA.',
    price_cents: 1000,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    stock: { S: 10, M: 10, L: 10, XL: 10, '2XL': 5 },
  },
  {
    id: 'tee-002',
    name: 'Dripping Springs Hill Country Tee',
    description: 'Vintage-style faded tee celebrating the Hill Country lifestyle. Super soft tri-blend fabric.',
    price_cents: 1000,
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    stock: { S: 10, M: 10, L: 10, XL: 10, '2XL': 5 },
  },
  {
    id: 'tee-003',
    name: 'Texas Crow Graphic Tee',
    description: 'Illustrated crow silhouette over a Texas state outline. Bold graphic, classic fit.',
    price_cents: 1000,
    images: ['https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=600&q=80'],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    stock: { S: 10, M: 10, L: 10, XL: 10, '2XL': 5 },
  },
]

export default function StorePage() {
  const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS)
  const [cart, setCart] = useState({})
  const [selectedSize, setSelectedSize] = useState({})
  const [checkoutEmail, setCheckoutEmail] = useState('')
  const [checkoutName, setCheckoutName] = useState('')
  const [showCheckout, setShowCheckout] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/store/products')
      .then(r => r.json())
      .then(({ products: p }) => { if (p?.length) setProducts(p) })
      .catch(() => {})
  }, [])

  function addToCart(productId) {
    const size = selectedSize[productId]
    if (!size) return
    const key = `${productId}__${size}`
    setCart(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }))
  }

  function removeFromCart(key) {
    setCart(prev => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const cartItems = Object.entries(cart).map(([key, qty]) => {
    const [productId, size] = key.split('__')
    const product = products.find(p => p.id === productId)
    return { key, productId, size, quantity: qty, product }
  }).filter(i => i.product)

  const cartTotal = cartItems.reduce((sum, i) => sum + (i.product.price_cents * i.quantity), 0)

  async function handleCheckout(e) {
    e.preventDefault()
    if (!cartItems.length) return
    if (!checkoutEmail) return setError('Email required')
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity })),
          customerEmail: checkoutEmail,
          customerName: checkoutName,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.url
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-amber-50 text-gray-900">
      {/* Header */}
      <header className="bg-amber-900 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href={PORTFOLIO_URL} className="text-amber-200 hover:text-white text-sm transition-colors">
            ← Portfolio
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">PAPI'S STORE</h1>
            <p className="text-amber-300 text-xs tracking-widest uppercase">Dripping Springs, Texas · Free Shipping</p>
          </div>
          <button onClick={() => setShowCheckout(!showCheckout)}
            className="relative bg-amber-700 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold transition-colors">
            🛒 Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {/* Price banner */}
        <div className="text-center mb-8">
          <span className="inline-block bg-green-700 text-white font-bold px-6 py-2 rounded-full text-lg">
            All Tees — $10.00 · Free Shipping · Ships USA
          </span>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow overflow-hidden flex flex-col">
              <img src={product.images?.[0]} alt={product.name}
                className="w-full h-56 object-cover" />
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-xl font-bold mb-1">{product.name}</h2>
                <p className="text-gray-600 text-sm mb-3 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-amber-900">$10.00</span>
                  <span className="text-xs text-gray-400">+ free shipping</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(product.sizes || []).map(size => (
                    <button key={size} onClick={() => setSelectedSize(prev => ({ ...prev, [product.id]: size }))}
                      className={`px-3 py-1 rounded-full text-sm border font-medium transition-colors ${
                        selectedSize[product.id] === size
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'border-gray-300 text-gray-700 hover:border-amber-700'
                      }`}>
                      {size}
                    </button>
                  ))}
                </div>
                <button onClick={() => addToCart(product.id)}
                  disabled={!selectedSize[product.id]}
                  className="w-full bg-amber-900 hover:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold py-2.5 rounded-lg transition-colors">
                  {selectedSize[product.id] ? 'Add to Cart' : 'Select a Size'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart / Checkout panel */}
        {showCheckout && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black">Your Cart</h2>
                  <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-black text-2xl leading-none">&times;</button>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Your cart is empty.</p>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {cartItems.map(item => (
                        <div key={item.key} className="flex items-center justify-between border-b pb-2">
                          <div>
                            <p className="font-semibold text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-500">Size: {item.size} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold">${(item.product.price_cents * item.quantity / 100).toFixed(2)}</span>
                            <button onClick={() => removeFromCart(item.key)} className="text-red-400 hover:text-red-600 text-lg leading-none">&times;</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between font-black text-lg mb-6 border-t pt-3">
                      <span>Total</span>
                      <span>${(cartTotal / 100).toFixed(2)}</span>
                    </div>

                    <form onSubmit={handleCheckout} className="space-y-3">
                      <input type="text" placeholder="Your name" value={checkoutName}
                        onChange={e => setCheckoutName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-700" />
                      <input type="email" placeholder="Email address *" required value={checkoutEmail}
                        onChange={e => setCheckoutEmail(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-700" />
                      {error && <p className="text-red-500 text-sm">{error}</p>}
                      <button type="submit" disabled={loading}
                        className="w-full bg-amber-900 hover:bg-amber-700 disabled:opacity-60 text-white font-black py-3 rounded-lg transition-colors text-lg">
                        {loading ? 'Redirecting to payment...' : 'Checkout with Stripe →'}
                      </button>
                      <p className="text-center text-xs text-gray-400">Secure checkout · Powered by Stripe</p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-amber-900 text-amber-200 text-center py-6 text-xs">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CrowLogo size={18} className="text-amber-400" />
          <span className="font-bold text-white">Papi's Store</span>
        </div>
        <p>Dripping Springs, Texas · All shirts $10 · Free US Shipping</p>
        <p className="mt-1">
          <a href={PORTFOLIO_URL} className="hover:text-white transition-colors">← Back to Portfolio</a>
          {' · '}
          <a href={CROW_URL} className="hover:text-white transition-colors">CROW News</a>
        </p>
      </footer>
    </div>
  )
}
