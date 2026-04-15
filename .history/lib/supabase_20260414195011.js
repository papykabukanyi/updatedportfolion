import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

// Browser / client-side (uses anon key, respects RLS)
export const supabase = createClient(url, anon)

// Server-side only (uses service role, bypasses RLS)
export function supabaseAdmin() {
  return createClient(url, service)
}
