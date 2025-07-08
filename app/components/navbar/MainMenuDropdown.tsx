'use client'

import { useEffect, useRef } from 'react'
import { Button, Paper, Popper } from '@mui/material'
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
    <Popper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal>
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
            onClick={onClose}
          >
            {item.label}
          </Button>
        ))}
      </Paper>
    </Popper>
  )
}
