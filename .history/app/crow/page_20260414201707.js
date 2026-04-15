'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import CrowLogo from '@/components/CrowLogo'

const PLACEHOLDER_ARTICLES = [
  {
    id: '1', title: 'City Council Approves New Development Plan for Downtown',
    summary: 'Dripping Springs City Council voted 4-1 to approve a mixed-use development proposal for the historic downtown district, bringing new retail and residential space.',
    category: 'City Hall', time: '2 hours ago', featured: true,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
  },
  {
    id: '2', title: 'HS Athletics: Dripping Springs Tigers Win Regional Championship',
    summary: 'The Tigers secured their spot in the state playoffs with a commanding 28-7 victory Friday night at Tiger Stadium.',
    category: 'Sports', time: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=600&q=80',
  },
  {
    id: '3', title: 'Water Authority Reports Record Conservation Rates This Quarter',
    summary: 'The Dripping Springs Water Supply Corp. announced residents reduced consumption by 18% compared to last year — a community record.',
    category: 'Environment', time: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    id: '4', title: 'New Hill Country Wildflower Trail Opens This Weekend',
    summary: 'A 4-mile scenic trail through native bluebonnet and Indian paintbrush fields opens to the public Saturday at Hamilton Pool Preserve.',
    category: 'Community', time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
  },
  {
    id: '5', title: 'Local Restaurant Week Returns with 30+ Participating Venues',
    summary: 'Dripping Springs Restaurant Week kicks off Monday with special prix-fixe menus and live music at over 30 Hill Country eateries.',
    category: 'Food & Drink', time: '1 day ago',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  },
]

const CATEGORY_COLORS = {
  'City Hall': 'bg-blue-900/40 text-blue-300',
  'Sports': 'bg-green-900/40 text-green-300',
  'Environment': 'bg-emerald-900/40 text-emerald-300',
  'Community': 'bg-purple-900/40 text-purple-300',
  'Food & Drink': 'bg-orange-900/40 text-orange-300',
}

function timeLabel(article) {
  const ts = article.time || article.published_at
  if (!ts) return ''
  if (article.time) return article.time // placeholder strings like "2 hours ago"
  const diff = Date.now() - new Date(ts).getTime()
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function CrowPage() {
  const [articles, setArticles] = useState(PLACEHOLDER_ARTICLES)
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(null)
  const [subscriberId, setSubscriberId] = useState(null)
  const [reactions, setReactions] = useState({})
  const [commentOpen, setCommentOpen] = useState(null)
  const [commentText, setCommentText] = useState('')

  useEffect(() => {
    const sid = localStorage.getItem('crow_subscriber_id')
    if (sid) setSubscriberId(sid)
    fetchArticles()
  }, [])

  async function fetchArticles() {
    try {
      const res = await fetch('/api/crow/articles?city=dripping-springs&status=published')
      if (res.ok) {
        const data = await res.json()
        if (data.articles?.length) setArticles(data.articles)
      }
    } catch (_) {}
  }

  async function handleSubscribe(e) {
    e.preventDefault()
    setSubStatus('loading')
    try {
      const res = await fetch('/api/crow/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, city: 'dripping-springs' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      localStorage.setItem('crow_subscriber_id', data.id)
      setSubscriberId(data.id)
      setSubStatus('ok')
    } catch { setSubStatus('err') }
  }

  async function handleReaction(articleId, type) {
    if (!subscriberId) return alert('Subscribe to react to articles!')
    try {
      const res = await fetch('/api/crow/reactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, subscriberId, type }),
      })
      const data = await res.json()
      setReactions(prev => ({ ...prev, [articleId]: data }))
    } catch (_) {}
  }

  async function handleComment(articleId) {
    if (!subscriberId) return alert('Subscribe to comment!')
    if (!commentText.trim()) return
    try {
      await fetch('/api/crow/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, subscriberId, body: commentText }),
      })
      setCommentText('')
      setCommentOpen(null)
    } catch (_) {}
  }

  const featured = articles[0]
  const side = articles.slice(1, 3)
  const bottom = articles.slice(3, 5)

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#1a1208]" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Masthead */}
      <header className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="text-xs text-gray-500 hover:text-black transition-colors font-sans">
            ← Back to Portfolio
          </Link>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <CrowLogo size={36} className="text-black" />
              <h1 className="text-5xl font-black tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>
                CROW
              </h1>
            </div>
            <p className="text-xs tracking-[0.3em] uppercase font-sans text-gray-600">
              Dripping Springs &bull; Texas &bull; Independent News
            </p>
            <div className="flex gap-4 justify-center mt-1 text-[10px] font-sans text-gray-500 tracking-wide">
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span>&bull;</span>
              <span>Free to Read</span>
              <span>&bull;</span>
              <span>Subscribe Below</span>
            </div>
          </div>
          <div className="w-24" />
        </div>
        {/* Section strip */}
        <div className="bg-black text-white text-[10px] font-sans tracking-widest uppercase">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex gap-6">
            {['Local News', 'Sports', 'Environment', 'Community', 'Food & Drink'].map(s => (
              <span key={s} className="hover:text-gray-300 cursor-pointer">{s}</span>
            ))}
          </div>
        </div>
      </header>

      {/* Newspaper grid — exactly 5 articles, no overflow scroll */}
      <main className="max-w-7xl mx-auto px-4 py-4" style={{ height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
        <div className="grid grid-cols-12 gap-3 h-full">
          {/* Featured article — spans 7 columns, full height */}
          {featured && (
            <article className="col-span-7 border-r border-gray-400 pr-3 flex flex-col">
              <div className="flex-1 overflow-hidden">
                <span className={`inline-block text-[10px] font-sans px-2 py-0.5 rounded mb-1 ${CATEGORY_COLORS[featured.category] || 'bg-gray-200 text-gray-700'}`}>
                  {featured.category}
                </span>
                <h2 className="text-3xl font-black leading-tight mb-2">{featured.title}</h2>
                {featured.image && (
                  <div className="relative w-full mb-2 overflow-hidden rounded" style={{ height: '200px' }}>
                    <img src={featured.image} alt={featured.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-gray-700 leading-snug text-sm line-clamp-4">{featured.summary}</p>
                <p className="text-xs text-gray-400 font-sans mt-1">{featured.time}</p>
              </div>
              {/* Reactions */}
              <div className="flex items-center gap-3 pt-2 border-t border-gray-300 mt-2">
                <button onClick={() => handleReaction(featured.id, 'like')} className="text-xs font-sans flex items-center gap-1 hover:text-green-700">
                  👍 {reactions[featured.id]?.likes ?? 0}
                </button>
                <button onClick={() => handleReaction(featured.id, 'dislike')} className="text-xs font-sans flex items-center gap-1 hover:text-red-700">
                  👎 {reactions[featured.id]?.dislikes ?? 0}
                </button>
                <button onClick={() => setCommentOpen(commentOpen === featured.id ? null : featured.id)} className="text-xs font-sans text-gray-500 hover:text-black">
                  💬 Comment
                </button>
              </div>
              {commentOpen === featured.id && (
                <div className="mt-2 flex gap-2">
                  <input value={commentText} onChange={e => setCommentText(e.target.value)}
                    className="flex-1 border border-gray-400 rounded px-2 py-1 text-xs font-sans" placeholder="Your comment..." />
                  <button onClick={() => handleComment(featured.id)} className="bg-black text-white text-xs px-3 py-1 rounded font-sans">Post</button>
                </div>
              )}
            </article>
          )}

          {/* Right column — 2 stacked + subscribe */}
          <div className="col-span-5 flex flex-col gap-3 h-full">
            {side.map((a, i) => (
              <article key={a.id} className={`flex gap-3 ${i < side.length - 1 ? 'border-b border-gray-400 pb-3' : ''}`} style={{ flex: '0 0 auto' }}>
                {a.image && (
                  <img src={a.image} alt={a.title} className="w-24 h-20 object-cover rounded flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <span className={`inline-block text-[9px] font-sans px-1.5 py-0.5 rounded mb-0.5 ${CATEGORY_COLORS[a.category] || 'bg-gray-200'}`}>
                    {a.category}
                  </span>
                  <h3 className="text-base font-bold leading-tight line-clamp-2">{a.title}</h3>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{a.summary}</p>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleReaction(a.id, 'like')} className="text-[10px] font-sans">👍 {reactions[a.id]?.likes ?? 0}</button>
                    <button onClick={() => handleReaction(a.id, 'dislike')} className="text-[10px] font-sans">👎 {reactions[a.id]?.dislikes ?? 0}</button>
                  </div>
                </div>
              </article>
            ))}

            {/* Bottom 2 articles */}
            <div className="grid grid-cols-2 gap-3 flex-1">
              {bottom.map(a => (
                <article key={a.id} className="border border-gray-300 rounded p-2 flex flex-col overflow-hidden">
                  {a.image && <img src={a.image} alt={a.title} className="w-full h-16 object-cover rounded mb-1" />}
                  <span className={`inline-block text-[9px] font-sans px-1.5 py-0.5 rounded mb-0.5 ${CATEGORY_COLORS[a.category] || 'bg-gray-200'}`}>
                    {a.category}
                  </span>
                  <h4 className="text-sm font-bold leading-tight line-clamp-3 flex-1">{a.title}</h4>
                  <div className="flex gap-1.5 mt-1">
                    <button onClick={() => handleReaction(a.id, 'like')} className="text-[10px] font-sans">👍 {reactions[a.id]?.likes ?? 0}</button>
                    <button onClick={() => handleReaction(a.id, 'dislike')} className="text-[10px] font-sans">👎 {reactions[a.id]?.dislikes ?? 0}</button>
                  </div>
                </article>
              ))}
            </div>

            {/* Mini subscribe */}
            <div className="bg-black text-white rounded-lg p-3 mt-auto flex-shrink-0">
              <p className="text-xs font-sans font-bold mb-2">📰 Subscribe to CROW News — Free</p>
              {subStatus === 'ok' ? (
                <p className="text-xs text-green-400 font-sans">✓ Subscribed! Welcome to the community.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-xs text-white placeholder-gray-400 font-sans focus:outline-none" />
                  <button type="submit" disabled={subStatus === 'loading'}
                    className="bg-white text-black text-xs px-3 py-1 rounded font-sans font-bold disabled:opacity-60">
                    {subStatus === 'loading' ? '...' : 'Join'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
