// hooks/useRequireAuth.ts
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/store/auth'

export function useRequireAuth() {
  const { user } = useAuth()
  const router = useRouter()

  const requireAuth = useCallback((action: () => void) => {
    if (!user?.id) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    action()
  }, [user?.id, router])

  return { requireAuth }
}
