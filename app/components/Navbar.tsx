'use client'
import { useState, useEffect, useRef } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Slide } from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  const [show, setShow] = useState(true)
  const lastScrollY = useRef(0)
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

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
      }, 100) // aguarda 100ms para processar scroll
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current)
    }
  }, [])

  
  return (
    <Slide appear={false} direction="down" in={show}>
      <AppBar color="primary">
        <Toolbar sx={{ display: 'flex', alignItems: 'center' }}>
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
                Rondon&apos;s Blog
              </Typography>
            </Link>
          </Box>
          <Box>
            <Button color="inherit" component={Link} href="/">Início</Button>
            <Button color="inherit" component={Link} href="/contato">Contato</Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Slide>
  )
}
