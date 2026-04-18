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
  construction: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
}

const NAV = [
  { key: 'portfolio', label: 'Portfolio', icon: icons.portfolio, color: 'cyan' },
  { key: 'crow', label: 'CROW News', icon: icons.crow, color: 'purple' },
  { key: 'store', label: "Papi's Store", icon: icons.store, color: 'amber' },
  { key: 'construction', label: 'Papy C&D', icon: icons.construction, color: 'orange' },
]

const ACCENT = {
  cyan: { tab: 'border-cyan-500 text-cyan-400', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20', btn: 'bg-cyan-700 hover:bg-cyan-600', ring: 'focus:border-cyan-500/50' },
  purple: { tab: 'border-purple-500 text-purple-400', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', btn: 'bg-purple-700 hover:bg-purple-600', ring: 'focus:border-purple-500/50' },
  amber: { tab: 'border-amber-500 text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', btn: 'bg-amber-700 hover:bg-amber-600', ring: 'focus:border-amber-500/50' },
  orange: { tab: 'border-orange-500 text-orange-400', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', btn: 'bg-orange-700 hover:bg-orange-600', ring: 'focus:border-orange-500/50' },
}

// ─── Input helper ─────────────────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'text', rows, options, accent = 'purple', required }) {
  const cls = `w-full bg-[#0d1020] border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-purple-500/60 focus:bg-[#111428] transition-all`
  return (
    <div>
      <label className="block text-xs text-gray-300 uppercase tracking-widest mb-2 font-bold">{label}{required && <span className="text-red-400 ml-0.5">*</span>}</label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={cls + ' cursor-pointer'} style={{ colorScheme: 'dark' }}>
          {options.map(o => <option key={typeof o === 'string' ? o : o.v} value={typeof o === 'string' ? o : o.v} style={{ background: '#0d1020', color: '#fff' }}>{typeof o === 'string' ? o : o.l}</option>)}
        </select>
      ) : rows ? (
        <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} className={cls + ' font-mono resize-y leading-relaxed'} required={required} />
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

  // Auto-init DB tables on first dashboard load
  useEffect(() => {
    fetch('/api/admin/setup', { method: 'POST' }).catch(() => {})
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/portfolio').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=articles').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=subscribers').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/crow?resource=comments').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/store?resource=products').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/store?resource=orders').then(r => r.json()).catch(() => ({})),
      fetch('/api/admin/construction').then(r => r.json()).catch(() => ({})),
    ]).then(([port, arts, subs, comms, prods, ords, con]) => {
      setStats({
        messages: port.messages?.length ?? 0,
        unread: port.messages?.filter(m => !m.read).length ?? 0,
        resumeViews: port.resumeViews?.total ?? 0,
        resumeViewsToday: port.resumeViews?.today ?? 0,
        resumeViewsWeek: port.resumeViews?.week ?? 0,
        articles: arts.articles?.length ?? 0,
        subscribers: subs.subscribers?.length ?? 0,
        comments: comms.comments?.filter(c => !c.approved).length ?? 0,
        products: prods.products?.length ?? 0,
        orders: ords.orders?.length ?? 0,
        pendingOrders: ords.orders?.filter(o => o.status === 'paid' || o.status === 'processing').length ?? 0,
        constructionLeads: con.leads?.length ?? 0,
        constructionNew: con.leads?.filter(l => l.status === 'new').length ?? 0,
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
          {section === 'construction' && <ConstructionSection stats={stats} />}
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
        <Stat label="Resume Views" value={stats.resumeViews} icon={icons.eye} color="violet" />
        <Stat label="Views Today" value={stats.resumeViewsToday} icon={icons.eye} color="violet" />
        <Stat label="Views This Week" value={stats.resumeViewsWeek} icon={icons.eye} color="violet" />
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
      <div className="max-w-3xl">
        <button onClick={() => setEditing(null)} className="flex items-center gap-1.5 text-gray-500 hover:text-white text-sm mb-5 transition-colors min-h-0">
          <Icon d="M10 19l-7-7m0 0l7-7m-7 7h18" size={15} /> Back to Articles
        </button>
        <div className="bg-[#080b14] border border-purple-500/20 rounded-2xl p-6">
          <h2 className="text-white font-black text-lg mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
            {editing === 'new' ? 'New Article' : 'Edit Article'}
          </h2>
          <form onSubmit={saveArticle} className="space-y-5">
            {/* Title — full width, large */}
            <Field label="Title *" value={form.title} onChange={f('title')} accent="purple" required />

            {/* Row: Slug + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Slug (URL path)" value={form.slug} onChange={f('slug')} accent="purple" required />
              <Field label="Status" value={form.status} onChange={f('status')} options={['draft', 'published']} accent="purple" />
            </div>

            {/* Row: Category + City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Category" value={form.category} onChange={f('category')} options={CATEGORIES} accent="purple" />
              <Field label="City" value={form.city} onChange={f('city')} options={CITIES} accent="purple" />
            </div>

            {/* Summary */}
            <Field label="Summary (shown in article cards)" value={form.summary} onChange={f('summary')} rows={3} accent="purple" />

            {/* Row: Image URL + Credit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Image URL" value={form.image_url} onChange={f('image_url')} accent="purple" />
              <Field label="Image Source / Credit" value={form.image_source} onChange={f('image_source')} accent="purple" />
            </div>

            {/* Content — tall */}
            <Field label="Article Content *" value={form.content} onChange={f('content')} rows={18} accent="purple" required />

            {msg && (
              <p className={`text-sm font-semibold px-4 py-2.5 rounded-xl ${msg === 'Saved!' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {msg}
              </p>
            )}
            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={saving} className="bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl text-sm transition-colors min-h-0">
                {saving ? 'Saving…' : editing === 'new' ? 'Publish Article' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-6 py-3 rounded-xl text-sm transition-colors min-h-0">
                Cancel
              </button>
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

// ═════════════════════════════════════════════════════════════════════════════
// CONSTRUCTION — Lead Management
// ═════════════════════════════════════════════════════════════════════════════
const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost']
const STATUS_COLORS = {
  new: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  quoted: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  won: 'bg-green-500/10 text-green-400 border-green-500/20',
  lost: 'bg-red-500/10 text-red-400 border-red-500/20',
}

function ConstructionSection({ stats }) {
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/construction')
    if (res.status === 401) { router.push('/pkvault'); return }
    const data = await res.json()
    setLeads(data.leads || [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function updateStatus(id, status) {
    await fetch('/api/admin/construction', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    setLeads(arr => arr.map(l => l.id === id ? { ...l, status } : l))
  }

  async function deleteLead(id) {
    if (!confirm('Delete this lead?')) return
    await fetch(`/api/admin/construction?id=${id}`, { method: 'DELETE' })
    setLeads(a => a.filter(l => l.id !== id))
  }

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter)

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Stat label="Total Leads" value={stats.constructionLeads ?? leads.length} icon={icons.construction} color="orange" />
        <Stat label="New Leads" value={stats.constructionNew ?? leads.filter(l => l.status === 'new').length} icon={icons.mail} color="orange" />
        <Stat label="Won" value={leads.filter(l => l.status === 'won').length} icon={icons.check} color="orange" />
        <Stat label="In Progress" value={leads.filter(l => l.status === 'contacted' || l.status === 'quoted').length} icon={icons.eye} color="orange" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-white/5 pb-1 flex-wrap">
        {['all', ...LEAD_STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all min-h-0 capitalize ${filter === s ? 'bg-orange-500/10 text-orange-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
            {s === 'all' ? `All (${leads.length})` : `${s} (${leads.filter(l => l.status === s).length})`}
          </button>
        ))}
        <button onClick={load} className="ml-auto text-gray-600 hover:text-orange-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 min-h-0">
          <Icon d={icons.refresh} size={14} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-600 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-600 text-sm">No leads yet.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(lead => (
            <div key={lead.id} className="bg-[#080b14] border border-white/5 hover:border-orange-500/20 rounded-2xl overflow-hidden transition-colors">
              <div className="px-5 py-4 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-white font-bold text-sm">{lead.name}</p>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${STATUS_COLORS[lead.status] || STATUS_COLORS.new}`}>{lead.status}</span>
                    {lead.budget && <span className="text-[10px] bg-white/5 border border-white/8 text-gray-400 px-2 py-0.5 rounded-full">{lead.budget}</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <a href={`tel:${lead.phone}`} className="text-orange-400 text-xs hover:underline">{lead.phone}</a>
                    <span className="text-gray-600 text-xs">·</span>
                    <a href={`mailto:${lead.email}`} className="text-gray-400 text-xs hover:text-white">{lead.email}</a>
                    {lead.city && <><span className="text-gray-600 text-xs">·</span><span className="text-gray-500 text-xs">📍 {lead.city}</span></>}
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-600 text-xs">{new Date(lead.created_at).toLocaleDateString()}</span>
                  </div>
                  {Array.isArray(lead.services) && lead.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lead.services.map(s => <span key={s} className="text-[10px] bg-orange-500/8 border border-orange-500/15 text-orange-400/80 px-2 py-0.5 rounded-full">{s}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                    className="bg-[#0d1020] border border-white/15 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-orange-500/40 cursor-pointer"
                    style={{ colorScheme: 'dark' }}>
                    {LEAD_STATUSES.map(s => <option key={s} value={s} style={{ background: '#0d1020' }}>{s}</option>)}
                  </select>
                  <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                    className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-2 rounded-xl text-xs transition-colors min-h-0">
                    {expanded === lead.id ? '▲' : '▼'}
                  </button>
                  <button onClick={() => deleteLead(lead.id)} className="bg-red-900/20 hover:bg-red-900/50 text-red-400 px-3 py-2 rounded-xl transition-colors min-h-0">
                    <Icon d={icons.trash} size={12} />
                  </button>
                </div>
              </div>
              {expanded === lead.id && (
                <div className="border-t border-white/5 px-5 py-4 grid sm:grid-cols-2 gap-4 bg-white/[0.02]">
                  {lead.scope && <div><p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Scope</p><p className="text-gray-300 text-sm">{lead.scope}</p></div>}
                  {lead.size && <div><p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Project Size</p><p className="text-gray-300 text-sm">{lead.size}</p></div>}
                  {lead.timeline && <div><p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Timeline</p><p className="text-gray-300 text-sm">{lead.timeline}</p></div>}
                  {lead.budget && <div><p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Budget</p><p className="text-gray-300 text-sm">{lead.budget}</p></div>}
                  {lead.notes && <div className="sm:col-span-2"><p className="text-gray-600 text-[10px] uppercase tracking-widest mb-1">Notes</p><p className="text-gray-300 text-sm leading-relaxed">{lead.notes}</p></div>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
