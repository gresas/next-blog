'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import {
  Container,
  TextField,    
  Button,
  Typography,
  Box,
  Autocomplete,
  CircularProgress
} from '@mui/material'
import privilegeRoles from '../generated/helpers'
import AccessDeniedPage from '../components/AccessDeniedPage'

interface Editoria {
  id: number
  nome: string
}

export default function EditorNoticia() {
  const router = useRouter()

  const [titulo, setTitulo] = useState('')
  const [autor, setAutor] = useState('')
  const [deck, setDeck] = useState('')
  const [linhaSuporte, setLinhaSuporte] = useState('')
  const [corpo, setCorpo] = useState('')
  const [editoria, setEditoria] = useState<Editoria | null>(null)

  const [editorias, setEditorias] = useState<Editoria[]>([])
  const [loadingEditorias, setLoadingEditorias] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const { isLoggedIn, loading, user } = useAuth()

  if (!isLoggedIn || !user) {
    router.push('/login')
    return null
  }

  useEffect(() => {
    fetch('/api/editorias')
      .then(res => res.json())
      .then(data => setEditorias(data))
      .catch(() => setError('Erro ao carregar editorias'))
      .finally(() => setLoadingEditorias(false))
  }, [])

  const handleSubmit = async () => {
    if (!editoria) {
      setError('Você precisa selecionar uma editoria.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo,
          autor,
          deck,
          linhaSuporte,
          corpo,
          editoriaId: editoria.id
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao publicar a notícia')
      }

      const novaNoticia = await res.json()
      router.push(`/noticia/${novaNoticia.id}`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  if (!privilegeRoles.includes(user.role)) {
    return (
      <AccessDeniedPage />
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 6, pt: 7 }}>
      <Typography variant="h4" gutterBottom>
        Criar Nova Notícia
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField fullWidth label="Título" variant="outlined" value={titulo} onChange={e => setTitulo(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Autor" variant="outlined" value={autor} onChange={e => setAutor(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Linha de Suporte" variant="outlined" value={linhaSuporte} onChange={e => setLinhaSuporte(e.target.value)} sx={{ mb: 2 }} />
      <TextField fullWidth label="Deck (Resumo)" variant="outlined" value={deck} onChange={e => setDeck(e.target.value)} sx={{ mb: 2 }} />

      <Autocomplete
        options={editorias}
        getOptionLabel={(option) => option.nome}
        value={editoria}
        onChange={(_, value) => setEditoria(value)}
        loading={loadingEditorias}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Editoria"
            variant="outlined"
            sx={{ mb: 2 }}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment :(
                <>
                  {loadingEditorias ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
                )
              },
            }}
          />
        )}
      />

      <TextField
        fullWidth
        label="Corpo da Notícia"
        multiline
        minRows={8}
        variant="outlined"
        value={corpo}
        onChange={(e) => setCorpo(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Publicando...' : 'Publicar Notícia'}
        </Button>
      </Box>
    </Container>
  )
}
