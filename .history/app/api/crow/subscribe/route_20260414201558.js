import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req) {
  try {
    const { email, name, city } = await req.json()
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const normalEmail = email.toLowerCase().trim()

    const { rows: existing } = await query(
      'SELECT id, banned FROM crow_subscribers WHERE email = $1',
      [normalEmail]
    )

    if (existing.length > 0) {
      if (existing[0].banned) {
        return NextResponse.json({ error: 'Unable to subscribe with this email.' }, { status: 403 })
      }
      return NextResponse.json({ id: existing[0].id, alreadySubscribed: true })
    }

    const { rows } = await query(
      'INSERT INTO crow_subscribers (email, name, city, confirmed) VALUES ($1, $2, $3, true) RETURNING id',
      [normalEmail, name || null, city || 'dripping-springs']
    )

    return NextResponse.json({ id: rows[0].id, alreadySubscribed: false })
  } catch (err) {
    console.error('subscribe error:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const { email, name, city } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const db = supabaseAdmin()

    // Check if already exists
    const { data: existing } = await db
      .from('crow_subscribers')
      .select('id, banned, confirmed')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      if (existing.banned) {
        return NextResponse.json({ error: 'Unable to subscribe with this email.' }, { status: 403 })
      }
      return NextResponse.json({ id: existing.id, alreadySubscribed: true })
    }

    const { data, error } = await db
      .from('crow_subscribers')
      .insert({ email: email.toLowerCase().trim(), name: name || null, city: city || 'dripping-springs', confirmed: true })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ id: data.id, alreadySubscribed: false })
  } catch (err) {
    console.error('subscribe error:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
