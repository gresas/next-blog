'use client'
import { useEffect, useState } from 'react'
import { Container, Typography, Card, CardContent } from '@mui/material'

interface Noticia {
  id: number
  titulo: string
  autor: string
  deck: string
  linhaSuporte: string
  corpo: string
}

export default function HomePage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(setNoticias)
  }, [])

  return (
    <Container>
      <Typography variant="h3" gutterBottom>Notícias</Typography>
      {noticias.map(noticia => (
        <Card key={noticia.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{noticia.linhaSuporte}</Typography>
            <Typography variant="h4">{noticia.titulo}</Typography>
            <Typography variant="subtitle1">{noticia.deck}</Typography>
            <Typography variant="body2">Por {noticia.autor}</Typography>
          </CardContent>
        </Card>
      ))}
    </Container>
  )
}
