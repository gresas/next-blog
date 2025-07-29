'use client'

import { useEffect, useState } from 'react'
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Button,
  Stack,
} from '@mui/material'
import privilegeRoles from '../generated/helpers'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function UserPage() {
  const { user } = useAuth()
  const router = useRouter()
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

  if (loading) {
    return (
      <Container sx={{ mt: 4 }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Olá, {user?.nome}
      </Typography>

      {noticias.length === 0 ? (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Nenhuma notícia criada por você ainda.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {noticias.map((noticia: any) => (
            <Box
              key={noticia.id}
              sx={{
                p: 2,
                border: '1px solid #ccc',
                borderRadius: 2,
                cursor: 'pointer',
              }}
              onClick={() => router.push(`/noticia/${noticia.id}`)}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                {noticia.titulo}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Publicado em:{' '}
                {new Date(noticia.firstPublishAt).toLocaleDateString()}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}

      {user && privilegeRoles.includes(user.role) && (
        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => router.push('/editor')}
        >
          + Criar Notícia
        </Button>
      )}
    </Container>
  )
}
