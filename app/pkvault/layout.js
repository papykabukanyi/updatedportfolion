import { getAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'

export default async function PkvaultLayout({ children }) {
  // Allow the login page itself to render without auth
  // Child pages that need auth check individually via getAdminSession
  return children
}
