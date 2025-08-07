// components/ProtectedRoute.tsx
'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './AuthContext'
import { CircularProgress, Box } from '@mui/material'

interface Props {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push(`/login?from=${pathname}`)
    }
  }, [isLoggedIn, loading, pathname, router])

  if (loading || !isLoggedIn) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}