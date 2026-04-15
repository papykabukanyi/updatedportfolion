// ─── Railway PostgreSQL schema ────────────────────────────────────────────────
// Run via Railway dashboard → your Postgres service → Query tab
// or: psql "postgresql://postgres:sLRsDnTUCedupRshJhnwLMRnuZUmwsba@monorail.proxy.rlwy.net:18725/railway"

export const SCHEMA_SQL = `

-- CROW subscribers
CREATE TABLE IF NOT EXISTS crow_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  city TEXT DEFAULT 'dripping-springs',
  confirmed BOOLEAN DEFAULT true,
  banned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CROW articles
CREATE TABLE IF NOT EXISTS crow_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  image_source TEXT,
  category TEXT DEFAULT 'Local News',
  city TEXT DEFAULT 'dripping-springs',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriber reactions per article (like / dislike) — one per subscriber
CREATE TABLE IF NOT EXISTS crow_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES crow_articles(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES crow_subscribers(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'dislike')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, subscriber_id)
);

-- Comments — require admin approval before showing
CREATE TABLE IF NOT EXISTS crow_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES crow_articles(id) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES crow_subscribers(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Papi's Store products
CREATE TABLE IF NOT EXISTS store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  seo_description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 1000,
  images JSONB DEFAULT '[]',
  sizes JSONB DEFAULT '["S","M","L","XL","2XL"]',
  stock JSONB DEFAULT '{}',
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders created by Stripe webhook after payment
CREATE TABLE IF NOT EXISTS store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  shipping_address JSONB,
  items JSONB DEFAULT '[]',
  amount_total INTEGER,
  status TEXT DEFAULT 'paid',
  tracking_number TEXT,
  label_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio contact form messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`

