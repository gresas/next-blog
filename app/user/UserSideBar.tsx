'use client'

import { useRouter } from 'next/navigation'
import { List, ListItemButton, ListItemText, Box } from '@mui/material'

interface SidebarProps {
  selected: string
  onSelect: (value: any) => void
  isEditor: null | boolean
}

export default function UserSidebar({ selected, onSelect, isEditor }: SidebarProps) {
  const router = useRouter()
  
  return (
    <Box sx={{ width: 200, borderRight: '1px solid #ddd', height: '100%' }}>
      <List>
        <ListItemButton selected={selected === 'perfil'} onClick={() => onSelect('perfil')}>
          <ListItemText primary="Editar Usuário" />
        </ListItemButton>

        {isEditor && (
          <ListItemButton selected={selected === 'editor'} onClick={() => onSelect('editor')}>
            <ListItemText primary="Modo Editor" />
          </ListItemButton>
        )}

        <ListItemButton onClick={() => router.push('/contato')}>
          <ListItemText primary="Ajuda" />
        </ListItemButton>
      </List>
    </Box>
  )
}
