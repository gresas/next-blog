'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Container,
  CircularProgress,
} from '@mui/material'
import privilegeRoles from '../generated/helpers'
import { useAuth } from '../context/AuthContext'
import AccessDeniedPage from '../components/AccessDeniedPage'
import UserSidebar from './UserSideBar'
import UserNewsSection from './UserNewsSection'
import UserEditSection from './UserEditSection'


export default function UserPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  
  const [selected, setSelected] = useState<'perfil' | 'editor'>('perfil')
  const [noticias, setNoticias] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  if (!isLoggedIn || !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/noticias?autorId=${user.id}`)
        .then(res => res.json())
        .then(data => setNoticias(data.noticias))
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user?.id])

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '80vh' }}>
      <UserSidebar
        selected={selected}
        onSelect={setSelected}
        isEditor={user && privilegeRoles.includes(user.role)}
      />

      <Box sx={{ flex: 1 }}>
        {selected === 'perfil' && <UserEditSection userId={user.id} />}
        {selected === 'editor' && <UserNewsSection noticias={noticias} />}
      </Box>
    </Box>
  )
}
