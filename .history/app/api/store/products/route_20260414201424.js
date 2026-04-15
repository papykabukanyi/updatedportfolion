import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { rows } = await query(
      'SELECT id, name, description, seo_description, price_cents, images, sizes, stock, stripe_price_id FROM store_products WHERE active = true ORDER BY created_at DESC'
    )
    return NextResponse.json({ products: rows })
  } catch (err) {
    console.error('products GET error:', err)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin()
      .from('store_products')
      .select('id, name, description, seo_description, price_cents, images, sizes, stock, stripe_price_id')
      .eq('active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ products: data || [] })
  } catch (err) {
    console.error('products GET error:', err)
    return NextResponse.json({ products: [] }, { status: 500 })
  }
}
