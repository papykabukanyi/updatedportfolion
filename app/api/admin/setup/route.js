import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/adminAuth'
import { query } from '@/lib/db'
import { SCHEMA_SQL } from '@/lib/schema'

export async function POST(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await query(SCHEMA_SQL)
    return NextResponse.json({ ok: true, message: 'Database tables initialized.' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
