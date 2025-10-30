'use client'
import React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Slide
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import MainMenuDropdown from './MainMenuDropdown'
import UserMenuDropdown from './UserMenuDropdown'


export function useHideOnScroll(debounce = 100) {
  const [show, setShow] = useState(true)
  const lastScrollY = useRef<number>(0)
  const timeoutRef = useRef<number | null>(null)
  const pathname = usePathname()

  // Reset on route change so we don't inherit previous hide state
  useEffect(() => {
    lastScrollY.current = typeof window !== 'undefined' ? window.scrollY : 0
    setShow(true)
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [pathname])

  const handleScroll = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      const current = window.scrollY
      if (current === 0) {
        setShow(true)
      } else if (current < lastScrollY.current) {
        setShow(true)
      } else if (current > lastScrollY.current) {
        setShow(false)
      }
      lastScrollY.current = current
    }, debounce) as unknown as number
  }, [debounce])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [handleScroll])

  return show
}


export default function Navbar() {
  // use isolated hook for scroll/hide logic
  const show = useHideOnScroll(100)

  const { isLoggedIn, logout } = useAuth()

  // Dropdown de menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(prev => (prev ? null : event.currentTarget))
  }

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(prev => (prev ? null : event.currentTarget))
  }

  return (
    <Slide appear={false} direction="down" in={show}>
      <AppBar color="primary" position="sticky">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Menu Hamburguer */}
          <IconButton
            onClick={handleMenuClick}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: 'primary.dark',
              borderRadius: 1,
              '&:hover': { backgroundColor: 'primary.main' }
            }}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>

          {/* Ícone do usuário (só se logado) */}
          <IconButton
            onClick={handleUserClick}
            sx={{ borderRadius: 1 }}
          >
            <Avatar sx={{ bgcolor: 'secondary.main' }}>
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Toolbar>

        {/* Dropdowns */}
        <MainMenuDropdown
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
        />
        <UserMenuDropdown
          isLoggedIn={isLoggedIn}
          anchorEl={userAnchorEl}
          onClose={() => setUserAnchorEl(null)}
          logout={logout}
        />
      </AppBar>
    </Slide>
  )
}
