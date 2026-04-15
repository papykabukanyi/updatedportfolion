'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CrowLogo from '@/components/CrowLogo'
import { FiLogOut, FiRefreshCw } from 'react-icons/fi'

const SECTIONS = ['CROW News', "Papi's Store"]

export default function AdminDashboard() {
  const router = useRouter()
  const [section, setSection] = useState('CROW News')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // Quick auth check on mount
    fetch('/api/admin/login', { method: 'GET' })
      .then(r => { if (r.status === 405) setAuthChecked(true) }) // 405 = route exists, we're session-checked per-request
      .catch(() => {})
    setAuthChecked(true)
  }, [])

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/pkvault')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CrowLogo size={28} className="text-purple-400" />
          <span className="font-black text-lg tracking-wide">PK Vault</span>
          <span className="text-gray-600 text-sm hidden sm:block">— Central Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
        >
          <FiLogOut size={15} /> Logout
        </button>
      </header>

      {/* Section tabs */}
      <div className="border-b border-gray-800 px-6">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {SECTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`px-5 py-3 text-sm font-bold transition-colors border-b-2 -mb-px ${
                section === s
                  ? s === 'CROW News'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-amber-500 text-amber-400'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {s === 'CROW News' ? '🐦 CROW News' : "🛍 Papi's Store"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {section === 'CROW News' ? <CrowAdminPanel /> : <StoreAdminPanel />}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CROW Admin Panel
// ─────────────────────────────────────────────────────────────────────────────

const CROW_TABS = ['Articles', 'Subscribers', 'Comments']

function CrowAdminPanel() {
  const router = useRouter()
  const [tab, setTab] = useState('Articles')
  const [articles, setArticles] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', slug: '', summary: '', content: '', image_url: '', image_source: '', category: 'Local News', city: 'dripping-springs', status: 'draft' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchAll() }, [tab])

  async function fetchAll() {
    setLoading(true)
    const resourceMap = { Articles: 'articles', Subscribers: 'subscribers', Comments: 'comments' }
    const res = await fetch(`/api/admin/crow?resource=${resourceMap[tab]}`)
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    if (tab === 'Articles') setArticles(data.articles || [])
    if (tab === 'Subscribers') setSubscribers(data.subscribers || [])
    if (tab === 'Comments') setComments(data.comments || [])
    setLoading(false)
  }

  function startNew() {
    setForm({ title: '', slug: '', summary: '', content: '', image_url: '', image_source: '', category: 'Local News', city: 'dripping-springs', status: 'draft' })
    setEditing('new')
    setMsg('')
  }

  function startEdit(article) {
    setForm({ title: article.title, slug: article.slug, summary: article.summary || '', content: article.content || '', image_url: article.image_url || '', image_source: article.image_source || '', category: article.category || 'Local News', city: article.city || 'dripping-springs', status: article.status || 'draft' })
    setEditing(article)
    setMsg('')
  }

  async function saveArticle(e) {
    e.preventDefault()
    setSaving(true); setMsg('')
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH'
      const body = editing === 'new' ? form : { id: editing.id, ...form }
      const res = await fetch('/api/admin/crow', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg('Saved!'); setEditing(null); fetchAll()
    } catch (err) { setMsg(err.message) }
    setSaving(false)
  }

  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=article`, { method: 'DELETE' })
    fetchAll()
  }

  async function toggleBan(sub) {
    await fetch('/api/admin/crow', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: sub.id, resource: 'subscriber', banned: !sub.banned }) })
    fetchAll()
  }

  async function toggleComment(c) {
    await fetch('/api/admin/crow', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, resource: 'comment', approved: !c.approved }) })
    fetchAll()
  }

  async function deleteComment(id) {
    if (!confirm('Delete comment?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=comment`, { method: 'DELETE' })
    fetchAll()
  }

  if (editing) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-1">← Back to Articles</button>
        <h2 className="text-xl font-black mb-6">{editing === 'new' ? 'New Article' : 'Edit Article'}</h2>
        <form onSubmit={saveArticle} className="space-y-4">
          {[['title', 'Title'], ['slug', 'Slug'], ['summary', 'Summary'], ['image_url', 'Image URL'], ['image_source', 'Image Source Credit']].map(([k, label]) => (
            <div key={k}>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
              <input value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Category</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500">
                {['Local News', 'City Hall', 'Schools', 'Sports', 'Business', 'Community', 'Environment', 'Crime & Safety', 'Opinion'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Content (Markdown / Plain Text)</label>
            <textarea rows={12} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500 font-mono" />
          </div>
          {msg && <p className={msg === 'Saved!' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{msg}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-600 disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg transition-colors">
              {saving ? 'Saving…' : 'Save Article'}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="bg-gray-800 text-gray-400 px-6 py-2 rounded-lg hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-6">
        {CROW_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
        <button onClick={fetchAll} className="ml-auto text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"><FiRefreshCw size={14} /></button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading…</div>
      ) : tab === 'Articles' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">{articles.length} articles</h3>
            <button onClick={startNew} className="bg-purple-700 hover:bg-purple-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">+ New Article</button>
          </div>
          <div className="space-y-2">
            {articles.map(a => (
              <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-semibold text-white truncate">{a.title}</p>
                  <p className="text-xs text-gray-500">{a.category} · {a.status} · {a.city}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => startEdit(a)} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => deleteArticle(a.id)} className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'Subscribers' ? (
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm mb-4">{subscribers.length} subscribers</h3>
          {subscribers.map(s => (
            <div key={s.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{s.name || '—'} <span className="text-gray-400 text-sm">{s.email}</span></p>
                <p className="text-xs text-gray-600">{s.city} · {s.confirmed ? 'confirmed' : 'unconfirmed'} · {new Date(s.created_at).toLocaleDateString()}</p>
              </div>
              <button onClick={() => toggleBan(s)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${s.banned ? 'bg-green-900/50 text-green-400 hover:bg-green-900' : 'bg-red-900/50 text-red-400 hover:bg-red-900'}`}>
                {s.banned ? 'Unban' : 'Ban'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm mb-4">{comments.length} comments pending / approved</h3>
          {comments.map(c => (
            <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-white text-sm">{c.body}</p>
              <p className="text-xs text-gray-500 mt-1">{c.crow_subscribers?.email || 'anonymous'} · Article {c.article_id?.slice(0, 8)}…</p>
              <div className="flex gap-2 mt-2">
                <button onClick={() => toggleComment(c)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${c.approved ? 'bg-yellow-800/50 text-yellow-400 hover:bg-yellow-800' : 'bg-green-900/50 text-green-400 hover:bg-green-900'}`}>
                  {c.approved ? 'Unapprove' : 'Approve'}
                </button>
                <button onClick={() => deleteComment(c.id)} className="text-xs bg-red-900/50 text-red-400 hover:bg-red-900 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Store Admin Panel
// ─────────────────────────────────────────────────────────────────────────────

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']
const STORE_TABS = ['Products', 'Orders']

function StoreAdminPanel() {
  const router = useRouter()
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editProduct, setEditProduct] = useState(null)
  const [pForm, setPForm] = useState({ name: '', description: '', seo_description: '', price_cents: 1000, images: ['', '', ''], sizes: ['S', 'M', 'L', 'XL', '2XL'], stock: {} })
  const [pSaving, setPSaving] = useState(false)
  const [pMsg, setPMsg] = useState('')
  const [editOrder, setEditOrder] = useState(null)
  const [oForm, setOForm] = useState({ status: '', tracking_number: '', label_url: '', notes: '' })
  const [oSaving, setOSaving] = useState(false)

  useEffect(() => { fetchAll() }, [tab])

  async function fetchAll() {
    setLoading(true)
    const res = await fetch(`/api/admin/store?resource=${tab === 'Products' ? 'products' : 'orders'}`)
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    if (tab === 'Products') setProducts(data.products || [])
    else setOrders(data.orders || [])
    setLoading(false)
  }

  async function saveProduct(e) {
    e.preventDefault(); setPSaving(true); setPMsg('')
    try {
      const payload = { ...pForm, images: pForm.images.filter(Boolean), sizes: typeof pForm.sizes === 'string' ? pForm.sizes.split(',').map(s => s.trim()) : pForm.sizes, price_cents: parseInt(pForm.price_cents) }
      const method = editProduct === 'new' ? 'POST' : 'PATCH'
      const body = editProduct === 'new' ? payload : { id: editProduct.id, ...payload }
      const res = await fetch('/api/admin/store', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error)
      setPMsg('Saved!'); setEditProduct(null); fetchAll()
    } catch (err) { setPMsg(err.message) }
    setPSaving(false)
  }

  async function deleteProduct(id) {
    if (!confirm('Delete product?')) return
    await fetch(`/api/admin/store?id=${id}&resource=product`, { method: 'DELETE' })
    fetchAll()
  }

  async function saveOrder(e) {
    e.preventDefault(); setOSaving(true)
    try {
      await fetch('/api/admin/store', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editOrder.id, resource: 'order', ...oForm }) })
      setEditOrder(null); fetchAll()
    } catch {}
    setOSaving(false)
  }

  if (editProduct) {
    return (
      <div className="max-w-xl">
        <button onClick={() => setEditProduct(null)} className="text-gray-400 hover:text-white text-sm mb-4">← Back to Products</button>
        <h2 className="text-xl font-black mb-6">{editProduct === 'new' ? 'New Product' : 'Edit Product'}</h2>
        <form onSubmit={saveProduct} className="space-y-4">
          {[['name', 'Name'], ['description', 'Description'], ['seo_description', 'SEO Description']].map(([k, label]) => (
            <div key={k}>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
              <input value={pForm[k]} onChange={e => setPForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Price (cents) — e.g. 1000 = $10</label>
            <input type="number" value={pForm.price_cents} onChange={e => setPForm(f => ({ ...f, price_cents: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Image URLs (one per line)</label>
            {pForm.images.map((img, i) => (
              <input key={i} value={img} onChange={e => { const imgs = [...pForm.images]; imgs[i] = e.target.value; setPForm(f => ({ ...f, images: imgs })) }} placeholder={`Image ${i + 1}`} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500 mb-2" />
            ))}
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Sizes (comma-separated)</label>
            <input value={Array.isArray(pForm.sizes) ? pForm.sizes.join(', ') : pForm.sizes} onChange={e => setPForm(f => ({ ...f, sizes: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
          </div>
          {pMsg && <p className={pMsg === 'Saved!' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{pMsg}</p>}
          <div className="flex gap-3">
            <button type="submit" disabled={pSaving} className="bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg transition-colors">{pSaving ? 'Saving…' : 'Save Product'}</button>
            <button type="button" onClick={() => setEditProduct(null)} className="bg-gray-800 text-gray-400 px-6 py-2 rounded-lg hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  if (editOrder) {
    return (
      <div className="max-w-xl">
        <button onClick={() => setEditOrder(null)} className="text-gray-400 hover:text-white text-sm mb-4">← Back to Orders</button>
        <h2 className="text-xl font-black mb-4">Edit Order</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6 text-sm">
          <p className="text-gray-400">Customer: <span className="text-white">{editOrder.customer_name} — {editOrder.customer_email}</span></p>
          <p className="text-gray-400 mt-1">Total: <span className="text-white">${(editOrder.amount_total / 100).toFixed(2)}</span></p>
          <p className="text-gray-400 mt-1">Session: <span className="text-gray-600 text-xs">{editOrder.stripe_session_id}</span></p>
        </div>
        <form onSubmit={saveOrder} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">Status</label>
            <select value={oForm.status} onChange={e => setOForm(f => ({ ...f, status: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500">
              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {[['tracking_number', 'Tracking Number'], ['label_url', 'Shipping Label URL'], ['notes', 'Internal Notes']].map(([k, label]) => (
            <div key={k}>
              <label className="text-xs text-gray-400 uppercase tracking-widest block mb-1">{label}</label>
              <input value={oForm[k]} onChange={e => setOForm(f => ({ ...f, [k]: e.target.value }))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-500" />
            </div>
          ))}
          <div className="flex gap-3">
            <button type="submit" disabled={oSaving} className="bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg transition-colors">{oSaving ? 'Saving…' : 'Update Order'}</button>
            <button type="button" onClick={() => setEditOrder(null)} className="bg-gray-800 text-gray-400 px-6 py-2 rounded-lg hover:text-white transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {STORE_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${tab === t ? 'bg-amber-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{t}</button>
        ))}
        <button onClick={fetchAll} className="ml-auto text-gray-500 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800"><FiRefreshCw size={14} /></button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-12 text-center">Loading…</div>
      ) : tab === 'Products' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">{products.length} products</h3>
            <button onClick={() => { setPForm({ name: '', description: '', seo_description: '', price_cents: 1000, images: ['', '', ''], sizes: ['S', 'M', 'L', 'XL', '2XL'], stock: {} }); setEditProduct('new') }} className="bg-amber-700 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">+ New Product</button>
          </div>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">${(p.price_cents / 100).toFixed(2)} · {p.active ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setPForm({ ...p, images: Array.isArray(p.images) ? [...p.images, '', ''].slice(0, 3) : ['', '', ''], sizes: p.sizes || [], stock: p.stock || {} }); setEditProduct(p) }} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors">Edit</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-xs bg-red-900/50 hover:bg-red-900 text-red-400 px-3 py-1.5 rounded-lg transition-colors">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-gray-400 text-sm mb-4">{orders.length} orders</h3>
          {orders.map(o => (
            <div key={o.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-medium text-white">{o.customer_name} <span className="text-gray-400 text-sm">{o.customer_email}</span></p>
                <p className="text-xs text-gray-500">${(o.amount_total / 100).toFixed(2)} · <span className={`font-semibold ${o.status === 'shipped' || o.status === 'delivered' ? 'text-green-400' : o.status === 'cancelled' ? 'text-red-400' : 'text-amber-400'}`}>{o.status}</span> · {new Date(o.created_at).toLocaleDateString()}</p>
                {o.tracking_number && <p className="text-xs text-cyan-400 mt-0.5">📦 {o.tracking_number}</p>}
              </div>
              <button onClick={() => { setEditOrder(o); setOForm({ status: o.status || 'paid', tracking_number: o.tracking_number || '', label_url: o.label_url || '', notes: o.notes || '' }) }} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0">Edit</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
