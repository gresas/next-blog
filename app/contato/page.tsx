'use client'
import React from 'react'
import { useState } from 'react'
import { useFakeLoading } from '../hooks/FakeLoading'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'

export default function ContatoPage() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loading  = useFakeLoading(500)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setSubmitting(true)

    try {
      const res = await fetch('/api/contato', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, mensagem })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Erro ao enviar mensagem')
      }

      setSuccess(true)
      setNome('')
      setEmail('')
      setMensagem('')
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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Contato</Typography>
      <Typography variant="body1" gutterBottom>
        Para entrar em contato conosco, envie sua mensagem abaixo:
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Mensagem"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          fullWidth
          multiline
          rows={4}
          required
          margin="normal"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={submitting}
        >
          {submitting ? 'Enviando...' : 'Enviar'}
        </Button>

        {success && <Alert sx={{ mt: 2 }} severity="success">Mensagem enviada com sucesso!</Alert>}
        {error && <Alert sx={{ mt: 2 }} severity="error">{error}</Alert>}
      </Box>
    </Container>
  )
}
