import { query } from '@/lib/db'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { rows } = await query(
      `SELECT id, name, email, subject, message, read, archived, created_at
       FROM contact_messages
       WHERE archived = false
       ORDER BY created_at DESC`
    )
    return NextResponse.json({ messages: rows })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, read, archived } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const { rows } = await query(
      `UPDATE contact_messages SET
         read = COALESCE($1, read),
         archived = COALESCE($2, archived)
       WHERE id = $3 RETURNING *`,
      [read ?? null, archived ?? null, id]
    )
    return NextResponse.json({ message: rows[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

  await query('DELETE FROM contact_messages WHERE id = $1', [id])
  return NextResponse.json({ ok: true })
}
