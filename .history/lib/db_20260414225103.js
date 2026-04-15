import { Pool } from 'pg'

const globalForPg = globalThis

if (!globalForPg._pgPool) {
  globalForPg._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  })
}

export async function query(text, params) {
  return globalForPg._pgPool.query(text, params)
}

export async function query(text, params) {
  return globalForPg._pgPool.query(text, params)
}
