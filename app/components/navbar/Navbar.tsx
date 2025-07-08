'use client'

import { useState, useEffect, useRef } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Slide,
  IconButton,
  Avatar
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import Link from 'next/link'
import MainMenuDropdown from './MainMenuDropdown'
import UserMenuDropdown from './UserMenuDropdown'

export default function Navbar() {
  const [show, setShow] = useState(true)
  const lastScrollY = useRef(0)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // Menu principal
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Menu usuário
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
      <AppBar color="primary">
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Botão quadrado */}
          <IconButton
            onClick={handleMenuClick}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: 'primary.dark',
              mr: 2,
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'primary.main'
              }
            }}
          >
            <MenuIcon sx={{ color: 'white' }} />
          </IconButton>

          {/* Logo */}
          <Box sx={{ flexGrow: 1 }}>
            <Link href="/" passHref legacyBehavior>
              <Typography
                component="a"
                variant="h6"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                Taupe&apos;s Blog
              </Typography>
            </Link>
          </Box>

          {/* Botões principais */}
          <Box>
            <Button color="inherit" component={Link} href="/">Início</Button>
            <Button color="inherit" component={Link} href="/contato">Contato</Button>
          </Box>

          {/* Ícone usuário */}
          <Box ml={2}>
            <IconButton
              aria-label="Usuário"
              color="inherit"
              size="large"
              onClick={handleUserClick}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                <AccountCircleIcon />
              </Avatar>
            </IconButton>
          </Box>

          {/* Dropdowns */}
          <MainMenuDropdown anchorEl={anchorEl} onClose={() => setAnchorEl(null)} />
          <UserMenuDropdown anchorEl={userAnchorEl} onClose={() => setUserAnchorEl(null)} />
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
