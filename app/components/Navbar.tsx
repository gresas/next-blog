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
  Popper,
  Paper
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import Link from 'next/link'

export default function Navbar() {
  const [show, setShow] = useState(true)
  const lastScrollY = useRef(0)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const dropdownOpen = Boolean(anchorEl)

  const menuRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setAnchorEl(null)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget)
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
        </Toolbar>

        {/* Dropdown quadrado */}
        <Popper open={dropdownOpen} anchorEl={anchorEl} placement="bottom-start" disablePortal>
          <Paper
            ref={menuRef}
            elevation={6}
            sx={{
              width: 256,
              height: 256,
              mt: 1,
              backgroundColor: 'background.paper',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 1,
              p: 1
            }}
          >
            {[ 
              { label: 'Início', href: '/' },
              { label: 'Editor', href: '/editor' },
              { label: 'Usuário', href: '/user' },
              { label: 'Contato', href: '/contato' }
            ].map((item, index) => (
              <Button
                key={index}
                component={Link}
                href={item.href}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  backgroundColor: 'primary.light',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.main'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Paper>
        </Popper>
      </AppBar>
    </Slide>
  )
}
