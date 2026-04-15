// ─── Supabase SQL schema — run this in your Supabase SQL editor ────────────
//
// CREATE TABLE crow_subscribers (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   email TEXT UNIQUE NOT NULL,
//   name TEXT,
//   city TEXT DEFAULT 'dripping-springs',
//   confirmed BOOLEAN DEFAULT FALSE,
//   banned BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE crow_articles (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   title TEXT NOT NULL,
//   slug TEXT UNIQUE NOT NULL,
//   summary TEXT,
//   body TEXT,
//   image_url TEXT,
//   image_source TEXT,
//   city TEXT DEFAULT 'dripping-springs',
//   status TEXT DEFAULT 'draft',
//   published_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE crow_reactions (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   article_id UUID REFERENCES crow_articles(id) ON DELETE CASCADE,
//   subscriber_id UUID REFERENCES crow_subscribers(id) ON DELETE CASCADE,
//   type TEXT NOT NULL,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   UNIQUE(article_id, subscriber_id)
// );
//
// CREATE TABLE crow_comments (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   article_id UUID REFERENCES crow_articles(id) ON DELETE CASCADE,
//   subscriber_id UUID REFERENCES crow_subscribers(id) ON DELETE CASCADE,
//   body TEXT NOT NULL,
//   approved BOOLEAN DEFAULT FALSE,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE store_products (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   name TEXT NOT NULL,
//   description TEXT,
//   seo_description TEXT,
//   price_cents INTEGER NOT NULL DEFAULT 1000,
//   images TEXT[] DEFAULT '{}',
//   sizes TEXT[] DEFAULT ARRAY['S','M','L','XL','XXL'],
//   stock JSONB DEFAULT '{}',
//   active BOOLEAN DEFAULT TRUE,
//   stripe_product_id TEXT,
//   stripe_price_id TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE store_orders (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   stripe_session_id TEXT UNIQUE,
//   stripe_payment_intent TEXT,
//   customer_email TEXT,
//   customer_name TEXT,
//   shipping_address JSONB,
//   items JSONB,
//   subtotal_cents INTEGER,
//   shipping_cents INTEGER DEFAULT 0,
//   total_cents INTEGER,
//   status TEXT DEFAULT 'pending',
//   tracking_number TEXT,
//   tracking_carrier TEXT,
//   shippo_transaction_id TEXT,
//   label_url TEXT,
//   notes TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_at TIMESTAMPTZ DEFAULT NOW()
// );

export const SCHEMA_REMINDER = 'Run the SQL above in Supabase > SQL Editor'
