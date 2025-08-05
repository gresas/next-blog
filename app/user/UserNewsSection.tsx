'use client'

import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import Link from 'next/link'

interface Noticia {
  id: number
  titulo: string
  firstPublishAt: string
}

interface Props {
  noticias: Noticia[]
}

export default function UserNewsSection({ noticias }: Props) {
  if (noticias.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1">Você ainda não criou nenhuma notícia.</Typography>
        <Button sx={{ mt: 2}} variant="contained" component={Link} href="/editor">+ Criar Notícia</Button>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Minhas Notícias</Typography>
        <Button variant="contained" component={Link} href="/editor">+ Criar Notícia</Button>
      </Box>
      {noticias.map(n => (
        <Card key={n.id} sx={{ mb: 2 }}>
          <CardContent>
            <Link href={`/noticia/${n.id}`} passHref>
              <Typography variant="subtitle1" fontWeight={600}>{n.titulo}</Typography>
            </Link>
            <Typography variant="caption" color="text.secondary">{new Date(n.firstPublishAt).toLocaleString()}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
