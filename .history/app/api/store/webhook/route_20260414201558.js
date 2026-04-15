import Stripe from 'stripe'
import { query } from '@/lib/db'
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
    const items = JSON.parse(session.metadata?.items || '[]')
    const shipping = session.shipping_details?.address

    await query(
      `INSERT INTO store_orders (stripe_session_id, customer_email, customer_name, shipping_address, items, amount_total, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'paid')
       ON CONFLICT (stripe_session_id) DO UPDATE SET status = 'paid'`,
      [session.id, session.customer_email, session.metadata?.customerName || '', JSON.stringify(shipping || null), JSON.stringify(items), session.amount_total]
    )

    // Decrement stock for each item
    for (const item of items) {
      const { rows } = await query('SELECT stock FROM store_products WHERE id = $1', [item.productId])
      if (rows[0]?.stock) {
        const newStock = { ...rows[0].stock }
        if (typeof newStock[item.size] === 'number') {
          newStock[item.size] = Math.max(0, newStock[item.size] - item.quantity)
        }
        await query('UPDATE store_products SET stock = $1 WHERE id = $2', [JSON.stringify(newStock), item.productId])
      }
    }
  }

  return NextResponse.json({ received: true })
}
