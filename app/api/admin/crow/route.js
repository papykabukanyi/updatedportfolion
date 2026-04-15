import { query } from '@/lib/db'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') || 'articles'

  try {
    if (resource === 'subscribers') {
      const { rows } = await query(
        'SELECT id, email, name, city, confirmed, banned, created_at FROM crow_subscribers ORDER BY created_at DESC'
      )
      return NextResponse.json({ subscribers: rows })
    }
    if (resource === 'comments') {
      const { rows } = await query(
        `SELECT c.id, c.body, c.approved, c.created_at, c.article_id,
                s.email AS subscriber_email, s.name AS subscriber_name
         FROM crow_comments c
         LEFT JOIN crow_subscribers s ON s.id = c.subscriber_id
         ORDER BY c.created_at DESC`
      )
      return NextResponse.json({ comments: rows })
    }
    const { rows } = await query(
      'SELECT id, title, slug, summary, status, city, category, published_at, created_at FROM crow_articles ORDER BY created_at DESC'
    )
    return NextResponse.json({ articles: rows })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { title, slug, summary, content, image_url, image_source, category, city, status } = await req.json()
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'title, slug, and content are required' }, { status: 400 })
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const publishedAt = status === 'published' ? new Date().toISOString() : null

    const { rows } = await query(
      `INSERT INTO crow_articles (title, slug, summary, content, image_url, image_source, category, city, status, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [title, cleanSlug, summary || '', content, image_url || null, image_source || null,
       category || 'Local News', city || 'dripping-springs', status || 'draft', publishedAt]
    )
    return NextResponse.json({ article: rows[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, resource, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (resource === 'subscriber') {
      const { rows } = await query(
        'UPDATE crow_subscribers SET banned = $1 WHERE id = $2 RETURNING *',
        [updates.banned, id]
      )
      return NextResponse.json({ data: rows[0] })
    }
    if (resource === 'comment') {
      const { rows } = await query(
        'UPDATE crow_comments SET approved = $1 WHERE id = $2 RETURNING *',
        [updates.approved, id]
      )
      return NextResponse.json({ data: rows[0] })
    }

    // article
    const cleanSlug = updates.slug?.toLowerCase().replace(/[^a-z0-9-]/g, '-') || null
    const publishedAt = updates.status === 'published'
      ? (updates.published_at || new Date().toISOString())
      : updates.published_at || null

    const { rows } = await query(
      `UPDATE crow_articles SET
         title = $1, slug = COALESCE($2, slug), summary = $3, content = $4,
         image_url = $5, image_source = $6, category = $7, city = $8,
         status = $9, published_at = COALESCE($10, published_at)
       WHERE id = $11 RETURNING *`,
      [updates.title, cleanSlug, updates.summary || '', updates.content,
       updates.image_url?.trim() || null, updates.image_source?.trim() || null,
       updates.category, updates.city, updates.status, publishedAt, id]
    )
    return NextResponse.json({ data: rows[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
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

  await query(`DELETE FROM ${table} WHERE id = $1`, [id])
  return NextResponse.json({ ok: true })
}

