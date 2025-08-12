'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Container,    
  Button,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


export default function AccessDeniedPage() {
  const router = useRouter()

  return (
    <Container maxWidth="sm" sx={{ mt: 18, mb: 6 }}>
        <Button
          onClick={() => router.back()}
          sx={{ mb: 1, gap: 1, pr: 1 }}
          startIcon={
            <ArrowBackIcon sx={{}}/>
          }
        >
          Voltar
        </Button>
        <Typography variant="h5" color="error" gutterBottom>
          Acesso Negado
        </Typography>
        <Typography variant="body1">
          Você não tem permissão para acessar esta página.
        </Typography>
      </Container>
  )
}
