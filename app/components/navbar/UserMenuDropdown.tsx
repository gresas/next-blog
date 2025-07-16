'use client'

import { useEffect, useRef } from 'react'
import { Button, Paper, Popper } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface UserMenuDropdownProps {
  anchorEl: HTMLElement | null
  onClose: () => void
  isLoggedIn: boolean
  onLogout?: () => void
}

export default function UserMenuDropdown({ anchorEl, onClose, isLoggedIn, onLogout }: UserMenuDropdownProps) {
  const open = Boolean(anchorEl)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorEl &&
        !(anchorEl.contains(event.target as Node))
      ) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, anchorEl, onClose])

  async function handleLogout() {
    onClose()
    try {
      const res = await fetch('/api/logout', { method: 'POST' })
      if (res.ok) {
        onLogout?.() // <- atualiza o estado de login no pai
        router.push('/')
      } else {
        console.error('Erro ao deslogar')
      }
    } catch (error) {
      console.error('Erro ao deslogar', error)
    }
  }


  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end" disablePortal sx={{ zIndex: 1200 }}>
      <Paper
        ref={menuRef}
        elevation={6}
        sx={{
          width: 150,
          mt: 1,
          backgroundColor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          p: 1
        }}
      >
        {!isLoggedIn && (
          <>
            <Button
              component={Link}
              href="/login"
              onClick={onClose}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Entrar
            </Button>
            <Button
              component={Link}
              href="/cadastrar"
              onClick={onClose}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Cadastrar-se
            </Button>
          </>
        )}

        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            sx={{ justifyContent: 'flex-start', textTransform: 'none', color: 'error.main' }}
          >
            Logout
          </Button>
        )}
      </Paper>
    </Popper>
  )
}
