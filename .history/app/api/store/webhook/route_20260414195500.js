import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const sig = req.headers.get('stripe-signature')
  const body = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const db = supabaseAdmin()

    const items = JSON.parse(session.metadata?.items || '[]')
    const shipping = session.shipping_details?.address

    await db.from('store_orders').upsert({
      stripe_session_id: session.id,
      customer_email: session.customer_email,
      customer_name: session.metadata?.customerName || '',
      shipping_address: shipping || null,
      items,
      amount_total: session.amount_total,
      status: 'paid',
    }, { onConflict: 'stripe_session_id' })

    // Decrement stock for each item
    for (const item of items) {
      const { data: product } = await db
        .from('store_products')
        .select('stock')
        .eq('id', item.productId)
        .single()

      if (product?.stock) {
        const newStock = { ...product.stock }
        if (typeof newStock[item.size] === 'number') {
          newStock[item.size] = Math.max(0, newStock[item.size] - item.quantity)
        }
        await db.from('store_products').update({ stock: newStock }).eq('id', item.productId)
      }
    }
  }

  return NextResponse.json({ received: true })
}
