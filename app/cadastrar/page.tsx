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

const senhaSeguraRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/

export default function CadastroPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [touched, setTouched] = useState(false)
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [showConfirmaSenha, setShowConfirmaSenha] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (senha !== confirmaSenha) {
      setError('As senhas não conferem')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Erro ao cadastrar')
      }

      router.push('/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isSenhaValida = senhaSeguraRegex.test(senha)

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Typography variant="h4" gutterBottom>Cadastro</Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <TextField
          label="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          fullWidth
          required
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          margin="normal"
          disabled={loading}
        />
        <TextField
          label="Senha"
          type={showSenha ? 'text' : 'password'}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onBlur={() => setTouched(true)}
          fullWidth
          required
          margin="normal"
          error={touched && !isSenhaValida}
          disabled={loading}
          helperText={
            touched && !isSenhaValida
              ? 'A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um símbolo.'
              : ''
          }
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
        <TextField
          label="Confirme a senha"
          type={showConfirmaSenha ? 'text' : 'password'}
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
          fullWidth
          required
          margin="normal"
          disabled={loading}
          slotProps={{
            input: {endAdornment :(
              <PasswordToggleAdornment
                visible={showConfirmaSenha}
                onToggle={() => setShowConfirmaSenha((prev) => !prev)}
              />
              )
            },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || !isSenhaValida}
          fullWidth
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
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
