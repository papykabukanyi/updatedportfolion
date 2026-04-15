import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

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
