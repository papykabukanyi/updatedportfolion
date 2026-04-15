import { supabaseAdmin } from '@/lib/supabase'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

// ── Articles ────────────────────────────────────────────────────────────────

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') || 'articles'
  const db = supabaseAdmin()

  if (resource === 'subscribers') {
    const { data, error } = await db
      .from('crow_subscribers')
      .select('id, email, name, city, confirmed, banned, created_at')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ subscribers: data || [] })
  }

  if (resource === 'comments') {
    const { data, error } = await db
      .from('crow_comments')
      .select('id, body, approved, created_at, article_id, crow_subscribers(email, name)')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ comments: data || [] })
  }

  // Default: articles
  const { data, error } = await db
    .from('crow_articles')
    .select('id, title, slug, summary, status, city, category, published_at, created_at')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles: data || [] })
}

export async function POST(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { title, slug, summary, content, image_url, image_source, category, city, status } = body

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin()
      .from('crow_articles')
      .insert({
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        summary: summary || '',
        content,
        image_url: image_url || null,
        image_source: image_source || null,
        category: category || 'Local News',
        city: city || 'dripping-springs',
        status: status || 'draft',
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ article: data })
  } catch (err) {
    console.error('admin crow POST error:', err)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { id, resource, ...updates } = body
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const db = supabaseAdmin()
    let table = 'crow_articles'

    if (resource === 'subscriber') table = 'crow_subscribers'
    if (resource === 'comment') table = 'crow_comments'

    if (table === 'crow_articles' && updates.status === 'published' && !updates.published_at) {
      updates.published_at = new Date().toISOString()
    }

    const { data, error } = await db.from(table).update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    console.error('admin crow PATCH error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const resource = searchParams.get('resource') || 'article'

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  const tableMap = { article: 'crow_articles', subscriber: 'crow_subscribers', comment: 'crow_comments' }
  const table = tableMap[resource]
  if (!table) return NextResponse.json({ error: 'Invalid resource' }, { status: 400 })

  const { error } = await supabaseAdmin().from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
