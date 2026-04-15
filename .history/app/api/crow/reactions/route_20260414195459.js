import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
