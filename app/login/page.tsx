'use client'
import { useState } from 'react'
import { useEffect } from 'react'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import PasswordToggleAdornment from '@/app/components/PasswordToggleAdornment'
import AlertMessage from '@/app/components/AlertMessage'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoggedIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loginLoading, setLoginLoading] = useState(false)
  const [showSenha, setShowSenha] = useState(false)
  const from = searchParams.get('from') || '/'

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.push('/')
    }
  }, [isLoggedIn, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
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
      setLoginLoading(false)
    }
  }

  if (loading || isLoggedIn) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {from == '/user' || from == '/editor' && (
        <AlertMessage
          message="Você precisa estar logado para acessar esta página."
          severity="info"
          animation="grow"
          duration={5000}
          onClose={() => setError(null)}
        />
      )}
      {from == '/cadastrar' && (
        <AlertMessage
          message="Usuário criado com sucesso! Faça login para continuar."
          severity="success"
          animation="grow"
          duration={0}
          onClose={() => setError(null)}
        />
      )}
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
          disabled={loginLoading}
        />
        <TextField
          label="Senha"
          type={showSenha ? 'text' : 'password'}
          required
          fullWidth
          margin="normal"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          disabled={loginLoading}
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
          disabled={loginLoading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loginLoading ? <CircularProgress size={24} /> : 'Entrar'}
        </Button>
        {error && (
          <AlertMessage
            message={error}
            severity="error"
            animation="grow"
            duration={3000}
            onClose={() => setError(null)}
          />
        )}
      </Box>
    </Container>
  )
}
