import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.ADMIN_JWT_SECRET || 'change-me-in-env'
const COOKIE = 'pk_admin'

export function signAdminToken() {
  return jwt.sign({ admin: true }, SECRET, { expiresIn: '12h' })
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export { COOKIE as ADMIN_COOKIE }
