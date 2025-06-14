'use client'
import { useEffect, useState } from 'react'
import { 
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress 
} from '@mui/material'
import NewsCard from './components/NewsCard'


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
  const [noticias, setNoticias] = useState<any[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const fetchNoticias = async (page: number) => {
    setLoading(true)
    const res = await fetch(`/api/noticias?page=${page}`)
    const data = await res.json()
    setNoticias(prev => [...prev, ...data.noticias])
    setHasMore((page * 10) < data.total)
    setLoading(false)
  }

  useEffect(() => {
    fetchNoticias(1)
  }, [])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchNoticias(nextPage)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Últimas Notícias</Typography>
      <Grid container spacing={3}>
        {noticias.map(noticia => (
          <Grid size={{ xs: 12, md:6 }} key={noticia.id}>
            <NewsCard noticia={noticia} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Grid container justifyContent="center" sx={{ mt: 2 }}>
          <CircularProgress />
        </Grid>
      )}

      {hasMore && !loading && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Button variant="contained" onClick={handleLoadMore}>
            Carregar mais
          </Button>
        </Grid>
      )}

      {!hasMore && noticias.length > 0 && (
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Todas as notícias foram carregadas.
          </Typography>
        </Grid>
      )}
    </Container>
  )
}
