'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Container, Typography, Grid, Card, CardContent } from '@mui/material'

interface Noticia {
  id: number
  titulo: string
  autor: string
  deck: string
  linhaSuporte: string
  corpo: string
  createdAt: string
  updatedAt: string
}

function formatarData(data: string) {
  const d = new Date(data)
  return d.toLocaleDateString('pt-BR')
}

export default function HomePage() {
  const [noticias, setNoticias] = useState<Noticia[]>([])

  useEffect(() => {
    fetch('/api/noticias')
      .then(res => res.json())
      .then(setNoticias)
  }, [])

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Últimas Notícias</Typography>
      <Grid container spacing={3}>
        {noticias.map(noticia => (
          <Grid size={{ xs: 12, md:6 }} key={noticia.id}>
          <Link href={`/noticia/${noticia.id}`} passHref style={{ textDecoration: 'none' }}>
            <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle2" color="secondary">{noticia.linhaSuporte}</Typography>
                  <Typography variant="h5">{noticia.titulo}</Typography>
                  <Typography variant="subtitle1" gutterBottom>{noticia.deck}</Typography>
                  <Typography variant="body2" color="text.secondary">Por {noticia.autor}</Typography>

                  {noticia.updatedAt === noticia.createdAt ? (
                    <Typography variant="caption" color="text.secondary">
                      Publicado em {formatarData(noticia.createdAt)}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      Atualizado em {formatarData(noticia.updatedAt)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
          </Link>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}
