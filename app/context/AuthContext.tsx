'use client'
import React from 'react'
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Role } from '../generated/prisma/client'

interface User {
  id: number
  nome: string
  email: string
  role: Role
}

interface AuthContextType {
  isLoggedIn: boolean
  user: User | null
  loading: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verifica autenticação sempre que o path mudar
  useEffect(() => {
    let mounted = true
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me')
        if (!mounted) return
        if (res.ok) {
          const data = await res.json()
          setUser(data)
          setIsLoggedIn(true)
        } else {
          setUser(null)
          setIsLoggedIn(false)
        }
      } catch {
        setUser(null)
        setIsLoggedIn(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    checkAuth()
    return () => { mounted = false }
  }, [pathname])

  const login = useCallback(async () => {
    await router.refresh()
  }, [router])

  const logout = useCallback(async () => {
    await fetch('/api/logout', { method: 'POST' })
    setUser(null)
    setIsLoggedIn(false)
    router.push('/')
    await router.refresh()
  }, [router])

  // Saving the context value so consumers only re-render when relevant values change
  const value = useMemo(() => ({
    isLoggedIn,
    user,
    loading,
    login,
    logout,
  }), [isLoggedIn, user, loading, login, logout])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
