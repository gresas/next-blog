'use client'

import { useEffect, useRef } from 'react'
import {
  Button,
  Paper,
  Popper,
  Stack,
  Box
} from '@mui/material'
import Link from 'next/link'

interface MainMenuDropdownProps {
  anchorEl: HTMLElement | null
  onClose: () => void
}

export default function MainMenuDropdown({ anchorEl, onClose }: MainMenuDropdownProps) {
  const open = Boolean(anchorEl)
  const menuRef = useRef<HTMLDivElement | null>(null)

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

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      disablePortal
      role="menu"
      style={{ zIndex: 1300 }} // garantir sobreposição correta
    >
      <Paper
        ref={menuRef}
        elevation={4}
        sx={{
          mt: 1,
          width: '200px',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          py: 1
        }}
      >
        <Stack spacing={1}>
          {[
            { label: 'Início', href: '/' },
            { label: 'Editor', href: '/editor' },
            { label: 'Usuário', href: '/user' },
            { label: 'Contato', href: '/contato' }
          ].map((item, index) => (
            <Box key={index} role="menuitem">
              <Button
                component={Link}
                href={item.href}
                fullWidth
                onClick={onClose}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  color: 'text.primary',
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'white'
                  }
                }}
              >
                {item.label}
              </Button>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Popper>
  )
}
