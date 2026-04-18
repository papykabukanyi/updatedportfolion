import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const event = body.event === 'download' ? 'download' : 'view'
    const referrer = req.headers.get('referer') || null
    const userAgent = req.headers.get('user-agent') || null

    await pool.query(
      `INSERT INTO resume_views (event, referrer, user_agent) VALUES ($1, $2, $3)`,
      [event, referrer, userAgent]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    // Silently fail — tracking should never break the page
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
