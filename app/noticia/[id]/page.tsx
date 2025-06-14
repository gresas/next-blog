'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Container,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material'

interface Noticia {
  id: number
  titulo: string
  autor: string
  deck: string
  linhaSuporte: string
  corpo: string
}

export default function PaginaNoticia() {
  const params = useParams()
  const [noticia, setNoticia] = useState<Noticia | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!params?.id) return
    fetch(`/api/noticias/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setNoticia(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params?.id])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  if (!noticia) {
    return (
      <Container sx={{ mt: 10 }}>
        <Typography variant="h5" color="error">
          Notícia não encontrada.
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6, pt: 7 }}>
      <Chip
        label={noticia.linhaSuporte}
        color="secondary"
        sx={{ mb: 2, fontWeight: 'bold' }}
      />

      <Typography variant="h3" component="h1" gutterBottom>
        {noticia.titulo}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
        Por {noticia.autor}
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        {noticia.deck}
      </Typography>

      <Divider sx={{ mb: 4 }} />

      <Typography variant="body1" sx={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
        {noticia.corpo}
      </Typography>
    </Container>
  )
}
