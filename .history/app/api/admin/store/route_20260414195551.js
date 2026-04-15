import { supabaseAdmin } from '@/lib/supabase'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') || 'products'
  const db = supabaseAdmin()

  if (resource === 'orders') {
    const { data, error } = await db
      .from('store_orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ orders: data || [] })
  }

  const { data, error } = await db
    .from('store_products')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ products: data || [] })
}

export async function POST(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { name, description, seo_description, price_cents, images, sizes, stock } = body

    if (!name || !price_cents) {
      return NextResponse.json({ error: 'name and price_cents are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin()
      .from('store_products')
      .insert({ name, description, seo_description, price_cents, images: images || [], sizes: sizes || [], stock: stock || {}, active: true })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ product: data })
  } catch (err) {
    console.error('admin store POST error:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, resource, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    const table = resource === 'order' ? 'store_orders' : 'store_products'
    const { data, error } = await supabaseAdmin().from(table).update(updates).eq('id', id).select().single()
    if (error) throw error
    return NextResponse.json({ data })
  } catch (err) {
    console.error('admin store PATCH error:', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const resource = searchParams.get('resource') || 'product'

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })
  const table = resource === 'order' ? 'store_orders' : 'store_products'

  const { error } = await supabaseAdmin().from(table).delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
