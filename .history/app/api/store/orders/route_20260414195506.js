import { supabaseAdmin } from '@/lib/supabase'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

  try {
    const { data, error } = await supabaseAdmin()
      .from('store_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return NextResponse.json({ orders: data || [] })
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

    const updates = {}
    if (status) updates.status = status
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber
    if (labelUrl !== undefined) updates.label_url = labelUrl
    if (notes !== undefined) updates.notes = notes

    const { data, error } = await supabaseAdmin()
      .from('store_orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ order: data })
  } catch (err) {
    console.error('orders PATCH error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
