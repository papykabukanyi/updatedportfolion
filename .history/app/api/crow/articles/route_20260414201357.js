import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city') || 'dripping-springs'
  const status = searchParams.get('status') || 'published'
  const limit = Math.min(parseInt(searchParams.get('limit') || '5'), 20)

  try {
    const params = []
    let sql = 'SELECT id, title, slug, summary, image_url, image_source, category, city, published_at FROM crow_articles WHERE 1=1'

    if (status !== 'all') {
      params.push(status)
      sql += ` AND status = $${params.length}`
    }
    if (city !== 'all') {
      params.push(city)
      sql += ` AND city = $${params.length}`
    }

    params.push(limit)
    sql += ` ORDER BY published_at DESC NULLS LAST LIMIT $${params.length}`

    const { rows } = await query(sql, params)
    return NextResponse.json({ articles: rows })
  } catch (err) {
    console.error('articles fetch error:', err)
    return NextResponse.json({ articles: [] }, { status: 500 })
  }
}
