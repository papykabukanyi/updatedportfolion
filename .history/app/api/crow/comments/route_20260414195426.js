import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const articleId = searchParams.get('articleId')
  if (!articleId) return NextResponse.json({ comments: [] })

  try {
    const { data, error } = await supabaseAdmin()
      .from('crow_comments')
      .select('id, body, created_at, crow_subscribers(name)')
      .eq('article_id', articleId)
      .eq('approved', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ comments: data || [] })
  } catch (err) {
    console.error('comments GET error:', err)
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req) {
  try {
    const { articleId, subscriberId, body } = await req.json()
    if (!articleId || !subscriberId || !body?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (body.length > 1000) {
      return NextResponse.json({ error: 'Comment too long (max 1000 chars)' }, { status: 400 })
    }

    const db = supabaseAdmin()

    const { data: sub } = await db
      .from('crow_subscribers')
      .select('id, banned')
      .eq('id', subscriberId)
      .single()

    if (!sub || sub.banned) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { data, error } = await db
      .from('crow_comments')
      .insert({ article_id: articleId, subscriber_id: subscriberId, body: body.trim(), approved: false })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id, pending: true })
  } catch (err) {
    console.error('comments POST error:', err)
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 })
  }
}
