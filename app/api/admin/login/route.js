import { signAdminToken, ADMIN_COOKIE } from '@/lib/adminAuth'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { password } = await req.json()
    if (!password) return NextResponse.json({ error: 'Password required' }, { status: 400 })

    const storedHash = process.env.ADMIN_PASSWORD_HASH
    const plainEnv = process.env.ADMIN_PASSWORD

    let valid = false
    if (storedHash) {
      valid = await bcrypt.compare(password, storedHash)
    } else if (plainEnv) {
      // Fallback: plain comparison (dev only — set ADMIN_PASSWORD_HASH in production)
      valid = password === plainEnv
    }

    if (!valid) {
      // Consistent timing to prevent timing attacks
      await bcrypt.hash('dummy', 10)
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = signAdminToken()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 12, // 12 hours
      path: '/',
    })
    return res
  } catch (err) {
    console.error('admin login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
