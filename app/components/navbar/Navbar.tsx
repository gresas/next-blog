'use client'
import React from 'react'
import { useState, useEffect, useRef } from 'react'
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

export default function Navbar() {
  const [show, setShow] = useState(true)
  const { isLoggedIn, logout } = useAuth()
  const lastScrollY = useRef(0)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Dropdown de menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null)

  useEffect(() => {
    function handleScroll() {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)

      debounceTimeout.current = setTimeout(() => {
        const currentScrollY = window.scrollY
        if (currentScrollY === 0) {
          setShow(true)
        } else if (currentScrollY < lastScrollY.current) {
          setShow(true)
        } else if (currentScrollY > lastScrollY.current) {
          setShow(false)
        }
        lastScrollY.current = currentScrollY
      }, 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
  }

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(userAnchorEl ? null : event.currentTarget)
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
          {(
            <IconButton
              onClick={handleUserClick}
              sx={{ borderRadius: 1 }}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          )}
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
