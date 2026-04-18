import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const { services, scope, size, timeline, budget, name, phone, email, city, notes } = body

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'name, phone, and email are required' }, { status: 400 })
    }

    const servicesJson = JSON.stringify(Array.isArray(services) ? services : [])

    await pool.query(
      `INSERT INTO construction_leads
         (services, scope, size, timeline, budget, name, phone, email, city, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [servicesJson, scope || null, size || null, timeline || null, budget || null,
       name.trim(), phone.trim(), email.trim().toLowerCase(), city || null, notes || null]
    )

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
