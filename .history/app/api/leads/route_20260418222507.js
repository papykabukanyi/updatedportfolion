import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const { services, scope, size, timeline, budget, name, email, contactMethod, callbackNumber, city, notes } = body

    // phone is only required when the user chose callback
    const phone = callbackNumber || null
    if (!name || !email) {
      return NextResponse.json({ error: 'name and email are required' }, { status: 400 })
    }
    if (contactMethod === 'callback' && !phone) {
      return NextResponse.json({ error: 'phone number is required for callback' }, { status: 400 })
    }

    const servicesJson = JSON.stringify(Array.isArray(services) ? services : [])

    await pool.query(
      `INSERT INTO construction_leads
         (services, scope, size, timeline, budget, name, phone, email, city, notes, contact_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT DO NOTHING`,
      [servicesJson, scope || null, size || null, timeline || null, budget || null,
       name.trim(), phone ? phone.trim() : null, email.trim().toLowerCase(), city || null, notes || null, contactMethod || null]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
