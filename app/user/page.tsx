'use client'
import { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
} from '@mui/material'
import ProtectedRoute from '@/app/context/ProtectedRoute'
import privilegeRoles from '@/app/generated/helpers'
import { useAuth } from '@/app/context/AuthContext'
import UserSidebar from './UserSideBar'
import UserNewsSection from './UserNewsSection'
import UserEditSection from './UserEditSection'


export default function UserPage() {
  const { user, isLoggedIn } = useAuth()
  
  const [selected, setSelected] = useState<'perfil' | 'editor'>('perfil')
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/noticias?autorId=${user.id}`)
        .then(res => res.json())
        .then(data => setNoticias(data.noticias))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user?.id])

  if (isLoggedIn && loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', minHeight: '80vh' }}>
        <UserSidebar
          selected={selected}
          onSelect={setSelected}
          isEditor={user && privilegeRoles.includes(user.role)}
        />

        <Box sx={{ flex: 1 }}>
          {user && selected === 'perfil' && <UserEditSection userId={user.id} />}
          {selected === 'editor' && <UserNewsSection noticias={noticias} />}
        </Box>
      </Box>
    </ProtectedRoute>
  )
}
