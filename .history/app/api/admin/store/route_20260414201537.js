import { query } from '@/lib/db'
import { getAdminSession } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'

export async function GET(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const resource = searchParams.get('resource') || 'products'

  try {
    if (resource === 'orders') {
      const { rows } = await query('SELECT * FROM store_orders ORDER BY created_at DESC')
      return NextResponse.json({ orders: rows })
    }
    const { rows } = await query('SELECT * FROM store_products ORDER BY created_at DESC')
    return NextResponse.json({ products: rows })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { name, description, seo_description, price_cents, images, sizes, stock } = await req.json()
    if (!name || !price_cents) {
      return NextResponse.json({ error: 'name and price_cents are required' }, { status: 400 })
    }

    const { rows } = await query(
      `INSERT INTO store_products (name, description, seo_description, price_cents, images, sizes, stock, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING *`,
      [name, description || null, seo_description || null, parseInt(price_cents),
       JSON.stringify(images || []), JSON.stringify(sizes || []), JSON.stringify(stock || {})]
    )
    return NextResponse.json({ product: rows[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  const session = await getAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id, resource, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    if (resource === 'order') {
      const { rows } = await query(
        `UPDATE store_orders SET
           status = COALESCE($1, status),
           tracking_number = COALESCE($2, tracking_number),
           label_url = COALESCE($3, label_url),
           notes = COALESCE($4, notes)
         WHERE id = $5 RETURNING *`,
        [updates.status || null, updates.tracking_number || null, updates.label_url || null, updates.notes || null, id]
      )
      return NextResponse.json({ data: rows[0] })
    }

    // product
    const { rows } = await query(
      `UPDATE store_products SET
         name = $1, description = $2, seo_description = $3, price_cents = $4,
         images = $5, sizes = $6, stock = $7, active = $8
       WHERE id = $9 RETURNING *`,
      [updates.name, updates.description || null, updates.seo_description || null,
       parseInt(updates.price_cents),
       JSON.stringify(updates.images || []), JSON.stringify(updates.sizes || []),
       JSON.stringify(updates.stock || {}),
       updates.active !== false,
       id]
    )
    return NextResponse.json({ data: rows[0] })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
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
  await query(`DELETE FROM ${table} WHERE id = $1`, [id])
  return NextResponse.json({ ok: true })
}

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
