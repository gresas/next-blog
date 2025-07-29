'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PasswordToggleAdornment from '../components/PasswordToggleAdornment'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao fazer login')
      }

      // Login ok, redireciona para home
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Email"
          type="email"
          required
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          label="Senha"
          type={showSenha ? 'text' : 'password'}
          required
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loading}
          slotProps={{
            input: {endAdornment :(
              <PasswordToggleAdornment
                visible={showSenha}
                onToggle={() => setShowSenha((prev) => !prev)}
              />
              )
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  )
}
