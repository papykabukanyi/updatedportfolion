import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(req) {
  try {
    const { articleId, subscriberId, type } = await req.json()
    if (!UUID.test(articleId) || !UUID.test(subscriberId) || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { rows: subs } = await query(
      'SELECT id, banned FROM crow_subscribers WHERE id = $1',
      [subscriberId]
    )
    if (!subs.length || subs[0].banned) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { rows: existing } = await query(
      'SELECT id, type FROM crow_reactions WHERE article_id = $1 AND subscriber_id = $2',
      [articleId, subscriberId]
    )

    if (existing.length > 0) {
      if (existing[0].type === type) {
        await query('DELETE FROM crow_reactions WHERE id = $1', [existing[0].id])
      } else {
        await query('UPDATE crow_reactions SET type = $1 WHERE id = $2', [type, existing[0].id])
      }
    } else {
      await query(
        'INSERT INTO crow_reactions (article_id, subscriber_id, type) VALUES ($1, $2, $3)',
        [articleId, subscriberId, type]
      )
    }

    const { rows: counts } = await query(
      'SELECT type, COUNT(*) as cnt FROM crow_reactions WHERE article_id = $1 GROUP BY type',
      [articleId]
    )
    const likes = parseInt(counts.find(r => r.type === 'like')?.cnt || 0)
    const dislikes = parseInt(counts.find(r => r.type === 'dislike')?.cnt || 0)

    return NextResponse.json({ likes, dislikes })
  } catch (err) {
    console.error('reactions error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get('articleId')
  if (!articleId || !UUID.test(articleId)) return NextResponse.json({ likes: 0, dislikes: 0 })

  try {
    const { rows } = await query(
      'SELECT type, COUNT(*) as cnt FROM crow_reactions WHERE article_id = $1 GROUP BY type',
      [articleId]
    )
    return NextResponse.json({
      likes: parseInt(rows.find(r => r.type === 'like')?.cnt || 0),
      dislikes: parseInt(rows.find(r => r.type === 'dislike')?.cnt || 0),
    })
  } catch {
    return NextResponse.json({ likes: 0, dislikes: 0 })
  }
}

export async function POST(req) {
  try {
    const { articleId, subscriberId, type } = await req.json()
    if (!articleId || !subscriberId || !['like', 'dislike'].includes(type)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Verify subscriber exists and isn't banned
    const { data: sub } = await db
      .from('crow_subscribers')
      .select('id, banned')
      .eq('id', subscriberId)
      .single()

    if (!sub || sub.banned) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Upsert reaction (toggle: if same type, remove it)
    const { data: existing } = await db
      .from('crow_reactions')
      .select('id, type')
      .eq('article_id', articleId)
      .eq('subscriber_id', subscriberId)
      .single()

    if (existing) {
      if (existing.type === type) {
        // Remove reaction (toggle off)
        await db.from('crow_reactions').delete().eq('id', existing.id)
      } else {
        // Change reaction type
        await db.from('crow_reactions').update({ type }).eq('id', existing.id)
      }
    } else {
      await db.from('crow_reactions').insert({ article_id: articleId, subscriber_id: subscriberId, type })
    }

    // Get updated counts
    const { data: counts } = await db
      .from('crow_reactions')
      .select('type')
      .eq('article_id', articleId)

    const likes = counts?.filter(r => r.type === 'like').length || 0
    const dislikes = counts?.filter(r => r.type === 'dislike').length || 0

    return NextResponse.json({ likes, dislikes })
  } catch (err) {
    console.error('reactions error:', err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get('articleId')
  if (!articleId) return NextResponse.json({ likes: 0, dislikes: 0 })

  try {
    const { data } = await supabaseAdmin()
      .from('crow_reactions')
      .select('type')
      .eq('article_id', articleId)

    const likes = data?.filter(r => r.type === 'like').length || 0
    const dislikes = data?.filter(r => r.type === 'dislike').length || 0
    return NextResponse.json({ likes, dislikes })
  } catch {
    return NextResponse.json({ likes: 0, dislikes: 0 })
  }
}
