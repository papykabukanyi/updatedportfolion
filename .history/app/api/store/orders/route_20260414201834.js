import { query } from '@/lib/db'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

  try {
    const { rows } = await query(
      'SELECT * FROM store_orders ORDER BY created_at DESC LIMIT $1',
      [limit]
    )
    return NextResponse.json({ orders: rows })
  } catch (err) {
    console.error('orders GET error:', err)
    return NextResponse.json({ orders: [] }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, status, trackingNumber, labelUrl, notes } = await req.json()
    if (!id) return NextResponse.json({ error: 'Order ID required' }, { status: 400 })

    const { rows } = await query(
      `UPDATE store_orders SET
         status = COALESCE($1, status),
         tracking_number = COALESCE($2, tracking_number),
         label_url = COALESCE($3, label_url),
         notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [status || null, trackingNumber || null, labelUrl || null, notes || null, id]
    )
    return NextResponse.json({ order: rows[0] })
  } catch (err) {
    console.error('orders PATCH error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

