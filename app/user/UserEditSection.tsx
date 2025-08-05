'use client'

import { useEffect, useState } from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'

interface UserId {
  userId: number
}

export default function UserEditSection({ userId }: UserId) {
  
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  
  const handleSubmit = async () => {
    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/me/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          nome,
          email
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao salvar as alterações')
      }

      setSuccess('Usuário atualizado com sucesso!')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>Editar Informações do Usuário</Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <form>
        <TextField fullWidth label="Nome" variant="outlined" value={nome} onChange={e => setNome(e.target.value)} sx={{ mb: 2 }} />
        <TextField fullWidth label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} sx={{ mb: 2 }} />
        <Button variant="contained" color="primary" onClick={handleSubmit} onSubmit={() => setSuccess(true)} disabled={submitting}>
          {submitting ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </form>
      {success && (
        <Typography color="success" sx={{ mb: 2 }}>
          {success}
        </Typography>
      )}
    </Box>
  )
}
