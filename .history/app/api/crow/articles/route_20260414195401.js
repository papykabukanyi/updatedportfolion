import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city') || 'dripping-springs'
  const status = searchParams.get('status') || 'published'
  const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20)

  try {
    let query = supabaseAdmin()
      .from('crow_articles')
      .select('id, title, slug, summary, image_url, image_source, category, city, published_at')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (status !== 'all') query = query.eq('status', status)
    if (city !== 'all') query = query.eq('city', city)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ articles: data || [] })
  } catch (err) {
    console.error('articles fetch error:', err)
    return NextResponse.json({ articles: [] }, { status: 500 })
  }
}
