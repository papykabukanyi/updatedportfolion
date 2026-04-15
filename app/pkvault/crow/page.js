'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CrowLogo from '@/components/CrowLogo'

const CROW_URL = process.env.NEXT_PUBLIC_CROW_URL || 'https://crow.up.railway.app'
const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || 'https://papys-store.up.railway.app'

const TABS = ['Articles', 'Subscribers', 'Comments']

export default function CrowAdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState('Articles')
  const [articles, setArticles] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)

  // Article editor state
  const [editing, setEditing] = useState(null) // null = list, 'new' = new form, obj = edit form
  const [form, setForm] = useState({ title: '', slug: '', summary: '', content: '', image_url: '', image_source: '', category: 'Local News', city: 'dripping-springs', status: 'draft' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { fetchAll() }, [tab])

  async function fetchAll() {
    setLoading(true)
    const resourceMap = { Articles: 'articles', Subscribers: 'subscribers', Comments: 'comments' }
    const r = resourceMap[tab]
    const res = await fetch(`/api/admin/crow?resource=${r}`)
    if (res.status === 401) { setAuthError(true); setLoading(false); return }
    const data = await res.json()
    if (r === 'articles') setArticles(data.articles || [])
    if (r === 'subscribers') setSubscribers(data.subscribers || [])
    if (r === 'comments') setComments(data.comments || [])
    setLoading(false)
  }

  function slugify(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  function startNew() {
    setForm({ title: '', slug: '', summary: '', content: '', image_url: '', image_source: '', category: 'Local News', city: 'dripping-springs', status: 'draft' })
    setEditing('new')
    setMsg('')
  }

  function startEdit(article) {
    setForm({ ...article })
    setEditing(article)
    setMsg('')
  }

  async function saveArticle(e) {
    e.preventDefault()
    setSaving(true)
    setMsg('')
    try {
      const isNew = editing === 'new'
      const res = await fetch('/api/admin/crow', {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? form : { ...form, id: editing.id }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMsg('Saved!')
      setEditing(null)
      fetchAll()
    } catch (err) { setMsg(err.message) }
    setSaving(false)
  }

  async function deleteArticle(id) {
    if (!confirm('Delete this article?')) return
    await fetch(`/api/admin/crow?id=${id}&resource=article`, { method: 'DELETE' })
    fetchAll()
  }

  async function patchSub(id, updates) {
    await fetch('/api/admin/crow', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, resource: 'subscriber', ...updates }),
    })
    fetchAll()
  }

  async function patchComment(id, updates) {
    await fetch('/api/admin/crow', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, resource: 'comment', ...updates }),
    })
    fetchAll()
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
      {/* Top bar */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CrowLogo size={24} className="text-purple-400" />
          <span className="font-black text-lg">CROW Admin</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/pkvault/store" className="text-amber-400 hover:text-amber-300">Papi's Store →</Link>
          <a href={CROW_URL} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">View CROW ↗</a>
          <button onClick={async () => { await fetch('/api/admin/login', { method: 'DELETE' }); router.push('/pkvault') }}
            className="text-gray-500 hover:text-white">Logout</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setEditing(null) }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${tab === t ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {loading ? <div className="text-gray-500">Loading...</div> : (
          <>
            {/* ── Articles Tab ── */}
            {tab === 'Articles' && (
              <>
                {editing ? (
                  <form onSubmit={saveArticle} className="bg-gray-900 rounded-xl p-6 space-y-4 max-w-3xl">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="font-black text-lg">{editing === 'new' ? 'New Article' : 'Edit Article'}</h2>
                      <button type="button" onClick={() => setEditing(null)} className="text-gray-500 hover:text-white">✕ Cancel</button>
                    </div>
                    {['title', 'slug', 'summary', 'image_url', 'image_source'].map(field => (
                      <div key={field}>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">{field.replace('_', ' ')}</label>
                        <input value={form[field] || ''} onChange={e => {
                          const val = e.target.value
                          setForm(prev => {
                            const next = { ...prev, [field]: val }
                            if (field === 'title' && editing === 'new') next.slug = slugify(val)
                            return next
                          })
                        }}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Content</label>
                      <textarea value={form.content || ''} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={10}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-mono" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Category</label>
                        <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                          {['Local News', 'Sports', 'Environment', 'Community', 'Food & Drink', 'Opinion', 'Events'].map(c => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">City</label>
                        <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1 uppercase tracking-widest">Status</label>
                        <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none">
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                    {msg && <p className={`text-sm ${msg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>}
                    <div className="flex gap-3 pt-2">
                      <button type="submit" disabled={saving}
                        className="bg-purple-700 hover:bg-purple-600 disabled:opacity-60 text-white font-bold px-6 py-2 rounded-lg">
                        {saving ? 'Saving...' : 'Save Article'}
                      </button>
                      {form.status === 'draft' && (
                        <button type="button" onClick={() => { setForm(p => ({ ...p, status: 'published' })); setTimeout(() => document.querySelector('form').requestSubmit(), 0) }}
                          className="bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-2 rounded-lg">
                          Publish Now
                        </button>
                      )}
                    </div>
                  </form>
                ) : (
                  <>
                    <button onClick={startNew} className="mb-4 bg-purple-700 hover:bg-purple-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
                      + New Article
                    </button>
                    <div className="bg-gray-900 rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                          <tr>
                            <th className="px-4 py-3 text-left">Title</th>
                            <th className="px-4 py-3 text-left">Category</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Published</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {articles.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">No articles yet.</td></tr>
                          )}
                          {articles.map(a => (
                            <tr key={a.id} className="hover:bg-gray-800/50">
                              <td className="px-4 py-3 font-medium max-w-xs truncate">{a.title}</td>
                              <td className="px-4 py-3 text-gray-400">{a.category}</td>
                              <td className="px-4 py-3">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${a.status === 'published' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                  {a.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-500 text-xs">
                                {a.published_at ? new Date(a.published_at).toLocaleDateString() : '—'}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button onClick={() => startEdit(a)} className="text-purple-400 hover:text-purple-300 mr-3 text-xs font-bold">Edit</button>
                                <button onClick={() => deleteArticle(a.id)} className="text-red-500 hover:text-red-400 text-xs font-bold">Delete</button>
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

            {/* ── Subscribers Tab ── */}
            {tab === 'Subscribers' && (
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">City</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Joined</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {subscribers.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-600">No subscribers yet.</td></tr>
                    )}
                    {subscribers.map(s => (
                      <tr key={s.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3 font-mono text-xs">{s.email}</td>
                        <td className="px-4 py-3 text-gray-300">{s.name || '—'}</td>
                        <td className="px-4 py-3 text-gray-400">{s.city}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${s.banned ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>
                            {s.banned ? 'Banned' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(s.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => patchSub(s.id, { banned: !s.banned })}
                            className={`text-xs font-bold mr-3 ${s.banned ? 'text-green-400 hover:text-green-300' : 'text-red-400 hover:text-red-300'}`}>
                            {s.banned ? 'Unban' : 'Ban'}
                          </button>
                          <button onClick={async () => { if (confirm('Delete subscriber?')) { await fetch(`/api/admin/crow?id=${s.id}&resource=subscriber`, { method: 'DELETE' }); fetchAll() } }}
                            className="text-gray-500 hover:text-red-400 text-xs font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── Comments Tab ── */}
            {tab === 'Comments' && (
              <div className="bg-gray-900 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Comment</th>
                      <th className="px-4 py-3 text-left">Subscriber</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {comments.length === 0 && (
                      <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-600">No comments yet.</td></tr>
                    )}
                    {comments.map(c => (
                      <tr key={c.id} className="hover:bg-gray-800/50">
                        <td className="px-4 py-3 max-w-xs text-sm text-gray-300">{c.body}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{c.crow_subscribers?.email || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${c.approved ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {c.approved ? 'Approved' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => patchComment(c.id, { approved: !c.approved })}
                            className={`text-xs font-bold mr-3 ${c.approved ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}>
                            {c.approved ? 'Unapprove' : 'Approve'}
                          </button>
                          <button onClick={async () => { if (confirm('Delete comment?')) { await fetch(`/api/admin/crow?id=${c.id}&resource=comment`, { method: 'DELETE' }); fetchAll() } }}
                            className="text-gray-500 hover:text-red-400 text-xs font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
