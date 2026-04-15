'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

// ─── Icons (inline SVG helpers) ───────────────────────────────────────────────
const Icon = ({ d, size = 16, ...p }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
)
const icons = {
  portfolio: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  crow: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  store: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  logout: 'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  refresh: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  edit: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  trash: 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  plus: 'M12 4v16m8-8H4',
  check: 'M5 13l4 4L19 7',
  x: 'M6 18L18 6M6 6l12 12',
  mail: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  eye: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  package: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  tag: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z',
  ban: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636',
  archive: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
}

const NAV = [
  { key: 'portfolio', label: 'Portfolio', icon: icons.portfolio, color: 'cyan' },
  { key: 'crow', label: 'CROW News', icon: icons.crow, color: 'purple' },
  { key: 'store', label: "Papi's Store", icon: icons.store, color: 'amber' },
]

const ACCENT = {
  cyan: { tab: 'border-cyan-500 text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', btn: 'bg-cyan-700 hover:bg-cyan-600', ring: 'focus:border-cyan-500/50' },
  purple: { tab: 'border-purple-500 text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', btn: 'bg-purple-700 hover:bg-purple-600', ring: 'focus:border-purple-500/50' },
  amber: { tab: 'border-amber-500 text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', btn: 'bg-amber-700 hover:bg-amber-600', ring: 'focus:border-amber-500/50' },
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', rows, options, accent = 'purple', required }) {
  const cls = `w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none ${ACCENT[accent].ring} transition-all`
  return (
    <div>
      <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={cls}>
          {options.map(o => <option key={typeof o === 'string' ? o : o.v} value={typeof o === 'string' ? o : o.v}>{typeof o === 'string' ? o : o.l}</option>)}
        </select>
      ) : rows ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cls + ' font-mono resize-none'} required={required} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} required={required} />
      )}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function Stat({ label, value, icon, color }) {
  return (
    <div className={`bg-${color}-500/5 border border-${color}-500/15 rounded-2xl p-4 flex items-center gap-3`}>
      <div className={`w-9 h-9 rounded-xl bg-${color}-500/10 flex items-center justify-center shrink-0`}>
        <Icon d={icon} size={16} className={`text-${color}-400`} />
      </div>
      <div>
        <p className="text-white font-black text-xl leading-none">{value ?? '—'}</p>
        <p className={`text-${color}-400/70 text-xs mt-0.5`}>{label}</p>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const router = useRouter()
  const [section, setSection] = useState('portfolio')
  const [stats, setStats] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/portfolio').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=articles').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=subscribers').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=comments').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/store?resource=products').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/store?resource=orders').then(r => r.json()).catch(() => ({})),
    ]).then(([port, arts, subs, comms, prods, ords]) => {
      setStats({
        messages: port.messages?.length ?? 0,
        unread: port.messages?.filter(m => !m.read).length ?? 0,
        articles: arts.articles?.length ?? 0,
        subscribers: subs.subscribers?.length ?? 0,
        comments: comms.comments?.filter(c => !c.approved).length ?? 0,
        products: prods.products?.length ?? 0,
        orders: ords.orders?.length ?? 0,
        pendingOrders: ords.orders?.filter(o => o.status === 'paid' || o.status === 'processing').length ?? 0,
      })
    })
  }, [section])

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.push('/pkvault')
  }

  const active = NAV.find(n => n.key === section)

  return (
    <div className="min-h-screen bg-[#050508] flex">

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-56 bg-[#080b14] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-violet-800 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm">PK</span>
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none">PK Vault</p>
              <p className="text-gray-600 text-[10px] mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map(n => (
            <button
              key={n.key}
              onClick={() => { setSection(n.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                section === n.key
                  ? n.color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' : n.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : 'bg-amber-500/10 text-amber-400'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <Icon d={n.icon} size={15} className="shrink-0" />
              {n.label}
              {n.key === 'portfolio' && stats.unread > 0 && (
                <span className="ml-auto text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded-full font-bold">{stats.unread}</span>
              )}
              {n.key === 'crow' && stats.comments > 0 && (
                <span className="ml-auto text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full font-bold">{stats.comments}</span>
              )}
              {n.key === 'store' && stats.pendingOrders > 0 && (
                <span className="ml-auto text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">{stats.pendingOrders}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-5">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:text-red-400 hover:bg-red-500/5 transition-all font-medium">
            <Icon d={icons.logout} size={15} />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#050508]/90 backdrop-blur-md border-b border-white/5 px-4 lg:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-white transition-colors p-1 min-h-0">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${ACCENT[active.color].badge}`}>{active.label}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <a href={process.env.NEXT_PUBLIC_PORTFOLIO_URL || 'https://hire-papy.up.railway.app'} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-gray-300 text-xs transition-colors min-h-0 px-2 py-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Portfolio
            </a>
            <a href={process.env.NEXT_PUBLIC_CROW_URL || 'https://crow.up.railway.app'} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-purple-400 text-xs transition-colors min-h-0 px-2 py-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              CROW
            </a>
            <a href={process.env.NEXT_PUBLIC_STORE_URL || 'https://papys-store.up.railway.app'} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-1.5 text-gray-600 hover:text-amber-400 text-xs transition-colors min-h-0 px-2 py-1">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              Store
            </a>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {section === 'portfolio' && <PortfolioSection stats={stats} onStatsChange={setStats} />}
          {section === 'crow' && <CrowSection stats={stats} />}
          {section === 'store' && <StoreSection stats={stats} />}
        </main>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// PORTFOLIO — Contact Messages
// ═════════════════════════════════════════════════════════════════════════════
function PortfolioSection({ stats, onStatsChange }) {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/portfolio')
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function markRead(id) {
    await fetch('/api/admin/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, read: true }) })
    setMessages(m => m.map(x => x.id === id ? { ...x, read: true } : x))
  }

  async function archive(id) {
    await fetch('/api/admin/portfolio', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, archived: true }) })
    setMessages(m => m.filter(x => x.id !== id))
    setOpen(null)
  }

  async function del(id) {
    if (!confirm('Delete this message permanently?')) return
    await fetch(`/api/admin/portfolio?id=${id}`, { method: 'DELETE' })
    setMessages(m => m.filter(x => x.id !== id))
    setOpen(null)
  }

  const openMsg = messages.find(m => m.id === open)

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Total Messages" value={stats.messages} icon={icons.mail} color="cyan" />
        <Stat label="Unread" value={stats.unread} icon={icons.eye} color="cyan" />
      </div>

      <div className="bg-[#080b14] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-white font-bold text-sm flex items-center gap-2">
            <Icon d={icons.mail} size={15} className="text-cyan-400" />Contact Inbox
          </h2>
          <button onClick={load} className="text-gray-600 hover:text-cyan-400 transition-colors min-h-0 p-1">
            <Icon d={icons.refresh} size={14} />
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-600 text-sm">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center text-gray-600 text-sm">No messages yet.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map(m => (
              <div
                key={m.id}
                className={`px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors ${open === m.id ? 'bg-white/[0.03]' : ''}`}
                onClick={() => { setOpen(open === m.id ? null : m.id); if (!m.read) markRead(m.id) }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!m.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />}
                      <p className={`text-sm font-semibold truncate ${m.read ? 'text-gray-300' : 'text-white'}`}>{m.name}</p>
                      <span className="text-gray-600 text-xs shrink-0">{m.email}</span>
                    </div>
                    <p className="text-gray-400 text-xs truncate">{m.subject}</p>
                  </div>
                  <span className="text-gray-600 text-xs shrink-0">{new Date(m.created_at).toLocaleDateString()}</span>
                </div>

                {open === m.id && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="flex items-center gap-1.5 bg-cyan-700 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors min-h-0">
                        <Icon d={icons.mail} size={13} /> Reply
                      </a>
                      <button onClick={() => archive(m.id)} className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-bold px-3 py-2 rounded-lg transition-colors min-h-0">
                        <Icon d={icons.archive} size={13} /> Archive
                      </button>
                      <button onClick={() => del(m.id)} className="flex items-center gap-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 text-xs font-bold px-3 py-2 rounded-lg transition-colors min-h-0 ml-auto">
                        <Icon d={icons.trash} size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// CROW — Articles / Subscribers / Comments
// ═════════════════════════════════════════════════════════════════════════════
const CROW_TABS = ['Articles', 'Subscribers', 'Comments']
const CATEGORIES = ['Local News', 'City Hall', 'Schools', 'Sports', 'Business', 'Community', 'Environment', 'Crime & Safety', 'Opinion']
const CITIES = ['dripping-springs', 'austin', 'cedar-park', 'round-rock', 'kyle', 'buda']

const BLANK_ARTICLE = { title: '', slug: '', summary: '', content: '', image_url: '', image_source: '', category: 'Local News', city: 'dripping-springs', status: 'draft' }

function CrowSection() {
  const router = useRouter()
  const [tab, setTab] = useState('Articles')
  const [articles, setArticles] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null) // null | 'new' | article obj
  const [form, setForm] = useState(BLANK_ARTICLE)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [subSearch, setSubSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const map = { Articles: 'articles', Subscribers: 'subscribers', Comments: 'comments' }
    const res = await fetch(`/api/admin/crow?resource=${map[tab]}`)
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    if (tab === 'Articles') setArticles(data.articles || [])
    if (tab === 'Subscribers') setSubscribers(data.subscribers || [])
    if (tab === 'Comments') setComments(data.comments || [])
    setLoading(false)
  }, [tab, router])

  useEffect(() => { load() }, [load])

  const f = (k) => (v) => setForm(x => ({ ...x, [k]: typeof v === 'string' ? v : v.target?.value ?? v }))

  async function saveArticle(e) {
    e.preventDefault(); setSaving(true); setMsg('')
    try {
      const method = editing === 'new' ? 'POST' : 'PATCH'
      const body = editing === 'new' ? form : { id: editing.id, ...form }
      const res = await fetch('/api/admin/crow', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error)
      setMsg('Saved!'); setEditing(null); load()
    } catch (err) { setMsg(err.message) }
    setSaving(false)
  }

  async function delArticle(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=article`, { method: 'DELETE' })
    setArticles(a => a.filter(x => x.id !== id))
  }

  async function toggleBan(s) {
    await fetch('/api/admin/crow', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: s.id, resource: 'subscriber', banned: !s.banned }) })
    setSubscribers(arr => arr.map(x => x.id === s.id ? { ...x, banned: !x.banned } : x))
  }

  async function deleteSub(id) {
    if (!confirm('Delete subscriber?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=subscriber`, { method: 'DELETE' })
    setSubscribers(a => a.filter(s => s.id !== id))
  }

  async function toggleApprove(c) {
    await fetch('/api/admin/crow', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: c.id, resource: 'comment', approved: !c.approved }) })
    setComments(arr => arr.map(x => x.id === c.id ? { ...x, approved: !x.approved } : x))
  }

  async function delComment(id) {
    if (!confirm('Delete comment?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=comment`, { method: 'DELETE' })
    setComments(a => a.filter(x => x.id !== id))
  }

  // Article editor
  if (editing) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-5 transition-colors min-h-0">
          <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={15} /> Back
        </button>
        <div className={`bg-[#080b14] border border-purple-500/15 rounded-2xl p-6`}>
          <h2 className="text-white font-black text-lg mb-5">{editing === 'new' ? '+ New Article' : 'Edit Article'}</h2>
          <form onSubmit={saveArticle} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Title" value={form.title} onChange={f('title')} accent="purple" required /></div>
              <Field label="Slug (URL)" value={form.slug} onChange={f('slug')} accent="purple" required />
              <Field label="Status" value={form.status} onChange={f('status')} options={['draft','published']} accent="purple" />
              <Field label="Category" value={form.category} onChange={f('category')} options={CATEGORIES} accent="purple" />
              <Field label="City" value={form.city} onChange={f('city')} options={CITIES} accent="purple" />
              <div className="col-span-2"><Field label="Summary" value={form.summary} onChange={f('summary')} rows={2} accent="purple" /></div>
              <Field label="Image URL" value={form.image_url} onChange={f('image_url')} accent="purple" />
              <Field label="Image Source Credit" value={form.image_source} onChange={f('image_source')} accent="purple" />
              <div className="col-span-2"><Field label="Content" value={form.content} onChange={f('content')} rows={14} accent="purple" required /></div>
            </div>
            {msg && <p className={msg === 'Saved!' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{msg}</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">
                {saving ? 'Saving…' : editing === 'new' ? 'Publish Article' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="bg-white/5 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const filteredSubs = subSearch ? subscribers.filter(s => s.email.includes(subSearch) || (s.name || '').toLowerCase().includes(subSearch.toLowerCase())) : subscribers

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-white/5 pb-1">
        {CROW_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all min-h-0 ${tab === t ? 'bg-purple-500/10 text-purple-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            {t}
            {t === 'Comments' && comments.filter(c => !c.approved).length > 0 && (
              <span className="ml-1.5 text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded-full">{comments.filter(c => !c.approved).length}</span>
            )}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-gray-600 hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 min-h-0">
          <Icon d={icons.refresh} size={14} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-600 text-sm">Loading…</div>
      ) : tab === 'Articles' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs">{articles.length} articles</p>
            <button onClick={() => { setForm(BLANK_ARTICLE); setMsg(''); setEditing('new') }} className="flex items-center gap-1.5 bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors min-h-0">
              <Icon d={icons.plus} size={13} /> New Article
            </button>
          </div>
          <div className="space-y-2">
            {articles.map(a => (
              <div key={a.id} className="bg-[#080b14] border border-white/5 hover:border-purple-500/20 rounded-xl px-4 py-3 flex items-center gap-4 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">{a.title}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{a.category} · {a.city} · <span className={a.status === 'published' ? 'text-green-400' : 'text-yellow-500'}>{a.status}</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setForm({ title: a.title, slug: a.slug, summary: a.summary || '', content: a.content || '', image_url: a.image_url || '', image_source: a.image_source || '', category: a.category || 'Local News', city: a.city || 'dripping-springs', status: a.status || 'draft' }); setMsg(''); setEditing(a) }} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors min-h-0">
                    <Icon d={icons.edit} size={12} /> Edit
                  </button>
                  <button onClick={() => delArticle(a.id)} className="flex items-center gap-1 bg-red-900/20 hover:bg-red-900/50 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-colors min-h-0">
                    <Icon d={icons.trash} size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : tab === 'Subscribers' ? (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-gray-500 text-xs shrink-0">{subscribers.length} subscribers</p>
            <input value={subSearch} onChange={e => setSubSearch(e.target.value)} placeholder="Search email or name…" className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500/40 transition-all" />
          </div>
          <div className="space-y-2">
            {filteredSubs.map(s => (
              <div key={s.id} className="bg-[#080b14] border border-white/5 rounded-xl px-4 py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{s.name || '—'} <span className="text-gray-500 font-normal">{s.email}</span></p>
                  <p className="text-gray-600 text-xs mt-0.5">{s.city} · {s.confirmed ? 'confirmed' : 'unconfirmed'} · {new Date(s.created_at).toLocaleDateString()} {s.banned && <span className="text-red-400 font-semibold">· BANNED</span>}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => toggleBan(s)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors min-h-0 ${s.banned ? 'bg-green-800/30 text-green-400 hover:bg-green-800/60' : 'bg-red-900/20 text-red-400 hover:bg-red-900/50'}`}>
                    {s.banned ? 'Unban' : 'Ban'}
                  </button>
                  <button onClick={() => deleteSub(s.id)} className="text-xs bg-red-900/20 hover:bg-red-900/50 text-red-400 px-3 py-1.5 rounded-lg transition-colors min-h-0">
                    <Icon d={icons.trash} size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs">{comments.filter(c => !c.approved).length} pending · {comments.filter(c => c.approved).length} approved</p>
          </div>
          <div className="space-y-2">
            {comments.map(c => (
              <div key={c.id} className={`bg-[#080b14] border rounded-xl px-4 py-3 transition-colors ${c.approved ? 'border-white/5' : 'border-purple-500/20'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-300 text-sm leading-relaxed">{c.body}</p>
                    <p className="text-gray-600 text-xs mt-1.5">
                      {c.subscriber_name || c.subscriber_email || 'anonymous'} · {new Date(c.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => toggleApprove(c)} className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors min-h-0 ${c.approved ? 'bg-yellow-800/30 text-yellow-400 hover:bg-yellow-800/60' : 'bg-green-800/30 text-green-400 hover:bg-green-800/60'}`}>
                      {c.approved ? 'Unapprove' : 'Approve'}
                    </button>
                    <button onClick={() => delComment(c.id)} className="text-xs bg-red-900/20 hover:bg-red-900/50 text-red-400 px-3 py-1.5 rounded-lg transition-colors min-h-0">
                      <Icon d={icons.trash} size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// STORE — Products / Orders
// ═════════════════════════════════════════════════════════════════════════════
const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'cancelled']
const STORE_TABS = ['Products', 'Orders']
const BLANK_PRODUCT = { name: '', description: '', seo_description: '', price_cents: 1000, images: ['', '', ''], sizes: 'S, M, L, XL, 2XL', stock: '{}', active: true }

function StoreSection() {
  const router = useRouter()
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [editP, setEditP] = useState(null)
  const [pForm, setPForm] = useState(BLANK_PRODUCT)
  const [pSaving, setPSaving] = useState(false)
  const [pMsg, setPMsg] = useState('')
  const [editO, setEditO] = useState(null)
  const [oForm, setOForm] = useState({ status: 'paid', tracking_number: '', label_url: '', notes: '' })
  const [oSaving, setOSaving] = useState(false)
  const [orderSearch, setOrderSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/admin/store?resource=${tab === 'Products' ? 'products' : 'orders'}`)
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    if (tab === 'Products') setProducts(data.products || [])
    else setOrders(data.orders || [])
    setLoading(false)
  }, [tab, router])

  useEffect(() => { load() }, [load])

  async function saveProduct(e) {
    e.preventDefault(); setPSaving(true); setPMsg('')
    try {
      const payload = {
        ...pForm,
        images: pForm.images.filter(Boolean),
        sizes: typeof pForm.sizes === 'string' ? pForm.sizes.split(',').map(s => s.trim()).filter(Boolean) : pForm.sizes,
        price_cents: parseInt(pForm.price_cents),
        stock: typeof pForm.stock === 'string' ? JSON.parse(pForm.stock || '{}') : pForm.stock,
        active: pForm.active !== false,
      }
      const method = editP === 'new' ? 'POST' : 'PATCH'
      const body = editP === 'new' ? payload : { id: editP.id, ...payload }
      const res = await fetch('/api/admin/store', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).error)
      setPMsg('Saved!'); setEditP(null); load()
    } catch (err) { setPMsg(err.message) }
    setPSaving(false)
  }

  async function delProduct(id) {
    if (!confirm('Delete product?')) return
    await fetch(`/api/admin/store?id=${id}&resource=product`, { method: 'DELETE' })
    setProducts(p => p.filter(x => x.id !== id))
  }

  async function saveOrder(e) {
    e.preventDefault(); setOSaving(true)
    await fetch('/api/admin/store', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editO.id, resource: 'order', ...oForm }) })
    setOrders(arr => arr.map(x => x.id === editO.id ? { ...x, ...oForm } : x))
    setEditO(null); setOSaving(false)
  }

  const fp = k => v => setPForm(x => ({ ...x, [k]: typeof v === 'string' ? v : v.target?.value ?? v }))

  // Product form
  if (editP) {
    return (
      <div className="max-w-2xl">
        <button onClick={() => setEditP(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-5 transition-colors min-h-0">
          <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={15} /> Back
        </button>
        <div className="bg-[#080b14] border border-amber-500/15 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-5">{editP === 'new' ? '+ New Product' : 'Edit Product'}</h2>
          <form onSubmit={saveProduct} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><Field label="Name" value={pForm.name} onChange={fp('name')} accent="amber" required /></div>
              <div className="col-span-2"><Field label="Description" value={pForm.description} onChange={fp('description')} rows={3} accent="amber" /></div>
              <div className="col-span-2"><Field label="SEO Description" value={pForm.seo_description} onChange={fp('seo_description')} accent="amber" /></div>
              <Field label="Price (cents) e.g. 1000 = $10" value={pForm.price_cents} onChange={fp('price_cents')} type="number" accent="amber" required />
              <Field label="Active" value={pForm.active ? 'true' : 'false'} onChange={v => setPForm(x => ({ ...x, active: v === 'true' }))} options={[{v:'true',l:'Active'},{v:'false',l:'Inactive'}]} accent="amber" />
              <Field label="Sizes (comma-separated)" value={typeof pForm.sizes === 'string' ? pForm.sizes : (pForm.sizes || []).join(', ')} onChange={fp('sizes')} accent="amber" />
              <Field label="Stock JSON e.g. {'S':10,'M':5}" value={typeof pForm.stock === 'string' ? pForm.stock : JSON.stringify(pForm.stock || {})} onChange={fp('stock')} accent="amber" />
            </div>
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1.5 font-semibold">Image URLs</label>
              {[0,1,2].map(i => (
                <input key={i} value={pForm.images[i] || ''} onChange={e => { const imgs = [...pForm.images]; imgs[i] = e.target.value; setPForm(x => ({ ...x, images: imgs })) }} placeholder={`Image ${i + 1} URL`} className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-amber-500/50 transition-all mb-2" />
              ))}
            </div>
            {pMsg && <p className={pMsg === 'Saved!' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>{pMsg}</p>}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={pSaving} className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">{pSaving ? 'Saving…' : 'Save Product'}</button>
              <button type="button" onClick={() => setEditP(null)} className="bg-white/5 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Order form
  if (editO) {
    return (
      <div className="max-w-xl">
        <button onClick={() => setEditO(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-5 transition-colors min-h-0">
          <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={15} /> Back
        </button>
        <div className="bg-[#080b14] border border-amber-500/15 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-4">Edit Order</h2>
          <div className="bg-white/[0.03] rounded-xl p-4 mb-5 text-sm space-y-1.5">
            <p className="text-gray-400">Customer: <span className="text-white font-semibold">{editO.customer_name}</span> <span className="text-gray-500">{editO.customer_email}</span></p>
            <p className="text-gray-400">Amount: <span className="text-white font-semibold">${(editO.amount_total / 100).toFixed(2)}</span></p>
            <p className="text-gray-400">Ordered: <span className="text-gray-300">{new Date(editO.created_at).toLocaleString()}</span></p>
            {editO.shipping_address && <p className="text-gray-400">Ship to: <span className="text-gray-300 text-xs">{typeof editO.shipping_address === 'object' ? [editO.shipping_address.line1, editO.shipping_address.city, editO.shipping_address.state, editO.shipping_address.postal_code].filter(Boolean).join(', ') : editO.shipping_address}</span></p>}
            {editO.items?.length > 0 && <p className="text-gray-400">Items: <span className="text-gray-300 text-xs">{Array.isArray(editO.items) ? editO.items.map(i => `${i.name || i.description} (${i.size || ''})`).join(', ') : JSON.stringify(editO.items)}</span></p>}
          </div>
          <form onSubmit={saveOrder} className="space-y-4">
            <Field label="Status" value={oForm.status} onChange={v => setOForm(x => ({ ...x, status: v }))} options={ORDER_STATUSES} accent="amber" />
            <Field label="Tracking Number" value={oForm.tracking_number} onChange={v => setOForm(x => ({ ...x, tracking_number: v }))} accent="amber" />
            <Field label="Shipping Label URL" value={oForm.label_url} onChange={v => setOForm(x => ({ ...x, label_url: v }))} accent="amber" />
            <Field label="Internal Notes" value={oForm.notes} onChange={v => setOForm(x => ({ ...x, notes: v }))} rows={3} accent="amber" />
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={oSaving} className="bg-amber-700 hover:bg-amber-600 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">{oSaving ? 'Saving…' : 'Update Order'}</button>
              <button type="button" onClick={() => setEditO(null)} className="bg-white/5 text-gray-400 hover:text-white px-6 py-2.5 rounded-xl text-sm transition-colors min-h-0">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  const filteredOrders = orderSearch ? orders.filter(o => (o.customer_email || '').includes(orderSearch) || (o.customer_name || '').toLowerCase().includes(orderSearch.toLowerCase()) || (o.tracking_number || '').includes(orderSearch)) : orders

  return (
    <div>
      <div className="flex gap-1 mb-5 border-b border-white/5 pb-1">
        {STORE_TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-bold rounded-lg transition-all min-h-0 ${tab === t ? 'bg-amber-500/10 text-amber-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>{t}</button>
        ))}
        <button onClick={load} className="ml-auto text-gray-600 hover:text-amber-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 min-h-0">
          <Icon d={icons.refresh} size={14} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-600 text-sm">Loading…</div>
      ) : tab === 'Products' ? (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 text-xs">{products.length} products</p>
            <button onClick={() => { setPForm({ ...BLANK_PRODUCT, images: ['','',''] }); setPMsg(''); setEditP('new') }} className="flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors min-h-0">
              <Icon d={icons.plus} size={13} /> New Product
            </button>
          </div>
          <div className="space-y-2">
            {products.map(p => (
              <div key={p.id} className="bg-[#080b14] border border-white/5 hover:border-amber-500/20 rounded-xl px-4 py-3 flex items-center gap-4 transition-colors">
                {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-white/10" />}
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold text-sm truncate">{p.name}</p>
                  <p className="text-gray-600 text-xs mt-0.5">${(p.price_cents / 100).toFixed(2)} · <span className={p.active ? 'text-green-400' : 'text-red-400'}>{p.active ? 'Active' : 'Inactive'}</span></p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => { setPForm({ name: p.name, description: p.description || '', seo_description: p.seo_description || '', price_cents: p.price_cents, images: [...(p.images || [,'','']).slice(0,3).concat(['','',''])].slice(0,3), sizes: Array.isArray(p.sizes) ? p.sizes.join(', ') : (p.sizes || ''), stock: typeof p.stock === 'object' ? JSON.stringify(p.stock) : (p.stock || '{}'), active: p.active }); setPMsg(''); setEditP(p) }} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors min-h-0">
                    <Icon d={icons.edit} size={12} /> Edit
                  </button>
                  <button onClick={() => delProduct(p.id)} className="flex items-center gap-1 bg-red-900/20 hover:bg-red-900/50 text-red-400 text-xs px-3 py-1.5 rounded-lg transition-colors min-h-0">
                    <Icon d={icons.trash} size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <p className="text-gray-500 text-xs shrink-0">{orders.length} orders</p>
            <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search customer, email, tracking…" className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-500/40 transition-all" />
          </div>
          <div className="space-y-2">
            {filteredOrders.map(o => (
              <div key={o.id} className="bg-[#080b14] border border-white/5 hover:border-amber-500/20 rounded-xl px-4 py-3 flex items-center justify-between gap-4 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{o.customer_name || 'Unknown'}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      o.status === 'delivered' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      o.status === 'shipped' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                      o.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{o.status}</span>
                  </div>
                  <p className="text-gray-600 text-xs">{o.customer_email} · ${(o.amount_total / 100).toFixed(2)} · {new Date(o.created_at).toLocaleDateString()}</p>
                  {o.tracking_number && <p className="text-cyan-400/70 text-xs mt-0.5">📦 {o.tracking_number}</p>}
                </div>
                <button onClick={() => { setEditO(o); setOForm({ status: o.status || 'paid', tracking_number: o.tracking_number || '', label_url: o.label_url || '', notes: o.notes || '' }) }} className="flex items-center gap-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-lg transition-colors min-h-0 shrink-0">
                  <Icon d={icons.edit} size={12} /> Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


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
