'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CrowLogo from '@/components/CrowLogo'

const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || 'https://crow.up.railway.app'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://papys-store.up.railway.app'

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function StoreAdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  // Product form state
  const [editProduct, setEditProduct] = useState(null)
  const [pForm, setPForm] = useState({ name: '', description: '', seo_description: '', price_cents: 1000, images: ['', '', ''], sizes: ['S', 'M', 'L', 'XL', '2XL'], stock: {} })
  const [pSaving, setPSaving] = useState(false)
  const [pMsg, setPMsg] = useState('')

  // Order edit state
  const [editOrder, setEditOrder] = useState(null)
  const [oForm, setOForm] = useState({ status: '', tracking_number: '', label_url: '', notes: '' })
  const [oSaving, setOSaving] = useState(false)

  useEffect(() => { fetchAll() }, [tab])

  async function fetchAll() {
    setLoading(true)
    const r = tab === 'Products' ? 'products' : 'orders'
    const res = await fetch(`/api/admin/store?resource=${r}`)
    if (res.status === 401) { setAuthError(true); setLoading(false); return }
    const data = await res.json()
    if (r === 'products') setProducts(data.products || [])
    else setOrders(data.orders || [])
    setLoading(false)
  }

  async function saveProduct(e) {
    e.preventDefault()
    setPSaving(true); setPMsg('')
    try {
      const isNew = editProduct === 'new'
      const payload = {
        ...pForm,
        images: pForm.images.filter(Boolean),
        stock: pForm.sizes.reduce((acc, s) => ({ ...acc, [s]: pForm.stock[s] ?? 10 }), {}),
        price_cents: parseInt(pForm.price_cents),
      }
      const res = await fetch('/api/admin/store', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? payload : { ...payload, id: editProduct.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPMsg('Saved!'); setEditProduct(null); fetchAll()
    } catch (err) { setPMsg(err.message) }
    setPSaving(false)
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/store?id=${id}&resource=product`, { method: 'DELETE' })
    fetchAll()
  }

  async function saveOrder(e) {
    e.preventDefault()
    setOSaving(true)
    await fetch('/api/admin/store', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...oForm, id: editOrder.id, resource: 'order' }),
    })
    setOSaving(false); setEditOrder(null); fetchAll()
  }

  function startEditProduct(p) {
    setPForm({ name: p.name, description: p.description || '', seo_description: p.seo_description || '', price_cents: p.price_cents || 1000, images: [...(p.images || []), '', '', ''].slice(0, 3), sizes: p.sizes || ['S', 'M', 'L', 'XL', '2XL'], stock: p.stock || {} })
    setEditProduct(p); setPMsg('')
  }

  if (authError) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
      <div className="text-center">
        <p className="mb-4">Session expired.</p>
        <Link href="/pkvault" className="bg-purple-700 px-6 py-2 rounded-lg font-bold">Login</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛒</span>
          <span className="font-black text-lg text-amber-400">Papi's Store Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pkvault/crow" className="text-purple-400 hover:text-purple-300">CROW Admin →</Link>
          <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">View Store ↗</a>
          <button onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); router.push('/pkvault') }}
            className="text-gray-500 hover:text-white">Logout</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-6">
          {['Products', 'Orders'].map(t => (
            <button key={t} onClick={() => { setTab(t); setEditProduct(null); setEditOrder(null) }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === t ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <div className="text-gray-500">Loading...</div> : (
          <>
            {/* ── Products ── */}
            {tab === 'Products' && (
              <>
                {editProduct ? (
                  <form onSubmit={saveProduct} className="bg-gray-900 rounded-xl p-6 space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between">
                      <h2 className="font-black text-lg">{editProduct === 'new' ? 'New Product' : 'Edit Product'}</h2>
                      <button type="button" onClick={() => setEditProduct(null)} className="text-gray-500 hover:text-white">✕ Cancel</button>
                    </div>
                    {[['Name', 'name'], ['Description', 'description'], ['SEO Description', 'seo_description']].map(([label, key]) => (
                      <div key={key}>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">{label}</label>
                        <input value={pForm[key]} onChange={e => setPForm(p => ({ ...p, [key]: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Price (cents, e.g. 1000 = $10.00)</label>
                      <input type="number" value={pForm.price_cents} onChange={e => setPForm(p => ({ ...p, price_cents: e.target.value }))}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Product Images (up to 3 URLs)</label>
                      {pForm.images.map((img, i) => (
                        <input key={i} value={img} onChange={e => setPForm(p => { const imgs = [...p.images]; imgs[i] = e.target.value; return { ...p, images: imgs } })}
                          placeholder={`Image URL ${i + 1}`}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none mb-2" />
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2 uppercase tracking-widest">Sizes & Stock</label>
                      <div className="grid grid-cols-5 gap-2">
                        {(pForm.sizes || []).map(size => (
                          <div key={size} className="text-center">
                            <div className="text-xs text-gray-400 mb-1">{size}</div>
                            <input type="number" value={pForm.stock[size] ?? 10} onChange={e => setPForm(p => ({ ...p, stock: { ...p.stock, [size]: parseInt(e.target.value) || 0 } }))}
                              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-sm text-white text-center focus:outline-none" />
                          </div>
                        ))}
                      </div>
                    </div>
                    {pMsg && <p className={`text-sm ${pMsg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>{pMsg}</p>}
                    <button type="submit" disabled={pSaving}
                      className="bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg">
                      {pSaving ? 'Saving...' : 'Save Product'}
                    </button>
                  </form>
                ) : (
                  <>
                    <button onClick={() => { setPForm({ name: '', description: '', seo_description: '', price_cents: 1000, images: ['', '', ''], sizes: ['S', 'M', 'L', 'XL', '2XL'], stock: {} }); setEditProduct('new'); setPMsg('') }}
                      className="mb-4 bg-amber-700 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
                      + New Product
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.length === 0 && <p className="text-gray-600">No products yet.</p>}
                      {products.map(p => (
                        <div key={p.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                          {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />}
                          <div className="p-4">
                            <h3 className="font-bold mb-1">{p.name}</h3>
                            <p className="text-amber-400 font-black text-lg mb-3">${(p.price_cents / 100).toFixed(2)}</p>
                            <div className="flex gap-2">
                              <button onClick={() => startEditProduct(p)} className="flex-1 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors">Edit</button>
                              <button onClick={() => deleteProduct(p.id)} className="bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">Del</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── Orders ── */}
            {tab === 'Orders' && (
              <>
                {editOrder && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <form onSubmit={saveOrder} className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="font-black text-lg">Update Order</h2>
                        <button type="button" onClick={() => setEditOrder(null)} className="text-gray-500 hover:text-white">✕</button>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Status</label>
                        <select value={oForm.status} onChange={e => setOForm(p => ({ ...p, status: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none">
                          {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      {[['Tracking Number', 'tracking_number'], ['Label URL', 'label_url'], ['Notes', 'notes']].map(([label, key]) => (
                        <div key={key}>
                          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">{label}</label>
                          <input value={oForm[key]} onChange={e => setOForm(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                        </div>
                      ))}
                      <button type="submit" disabled={oSaving}
                        className="w-full bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-lg">
                        {oSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  </div>
                )}
                <div className="bg-gray-900 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 text-left">Customer</th>
                        <th className="px-4 py-3 text-left">Items</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Tracking</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {orders.length === 0 && (
                        <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-600">No orders yet.</td></tr>
                      )}
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-gray-800/50">
                          <td className="px-4 py-3">
                            <p className="font-medium text-xs">{o.customer_name || '—'}</p>
                            <p className="text-gray-500 text-xs">{o.customer_email}</p>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">
                            {(o.items || []).map((i, idx) => <div key={idx}>{i.size} ×{i.quantity}</div>)}
                          </td>
                          <td className="px-4 py-3 font-bold text-amber-400">${((o.amount_total || 0) / 100).toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                              o.status === 'delivered' ? 'bg-green-900/50 text-green-400' :
                              o.status === 'shipped' ? 'bg-blue-900/50 text-blue-400' :
                              o.status === 'paid' ? 'bg-yellow-900/50 text-yellow-400' :
                              o.status === 'cancelled' ? 'bg-red-900/50 text-red-400' :
                              'bg-gray-800 text-gray-400'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {o.tracking_number ? (
                              <span className="font-mono text-green-400">{o.tracking_number}</span>
                            ) : <span className="text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-right">
                            <button onClick={() => { setEditOrder(o); setOForm({ status: o.status, tracking_number: o.tracking_number || '', label_url: o.label_url || '', notes: o.notes || '' }) }}
                              className="text-amber-400 hover:text-amber-300 text-xs font-bold">Update</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
