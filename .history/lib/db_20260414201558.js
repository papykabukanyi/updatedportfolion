import { Pool } from 'pg'

// Singleton pool — prevents multiple connections on Next.js hot reload in dev
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

/**
 * Run a parameterized SQL query against Railway PostgreSQL.
 * @param {string} text  SQL query (use $1, $2 … placeholders)
 * @param {any[]}  [params]  Bound parameters
 */
export async function query(text, params) {
  return globalForPg._pgPool.query(text, params)
}
