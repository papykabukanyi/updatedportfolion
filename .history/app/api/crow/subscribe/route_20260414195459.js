import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
