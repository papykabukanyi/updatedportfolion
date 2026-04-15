import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'pk_admin'
const SECRET = process.env.ADMIN_JWT_SECRET || 'fallback-dev-secret-change-in-production'

export function signAdminToken() {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: '12h' })
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE)?.value
    if (!token) return null
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}
