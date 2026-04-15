import Stripe from 'stripe'
import { query } from '@/lib/db'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  try {
    const { items, customerEmail, customerName, shippingAddress } = await req.json()

    if (!items?.length || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const lineItems = []

    for (const item of items) {
      const { data: product } = await db
        .from('store_products')
        .select('id, name, price_cents, stripe_price_id, stock')
        .eq('id', item.productId)
        .single()

      if (!product) return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 })

      const stockForSize = product.stock?.[item.size]
      if (typeof stockForSize === 'number' && stockForSize < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name} (${item.size})` }, { status: 400 })
      }

      if (product.stripe_price_id) {
        lineItems.push({ price: product.stripe_price_id, quantity: item.quantity })
      } else {
        lineItems.push({
          price_data: {
            currency: 'usd',
            unit_amount: product.price_cents,
            product_data: { name: `${product.name} — ${item.size}` },
          },
          quantity: item.quantity,
        })
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      shipping_address_collection: { allowed_countries: ['US'] },
      success_url: `${siteUrl}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/store`,
      metadata: {
        customerName: customerName || '',
        items: JSON.stringify(items.map(i => ({ productId: i.productId, size: i.size, quantity: i.quantity }))),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
