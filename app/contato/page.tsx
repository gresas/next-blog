'use client'
import { Container, Typography, TextField, Button, Box } from '@mui/material'

export default function ContatoPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Contato</Typography>
      <Typography variant="body1" gutterBottom>
        Para entrar em contato conosco, envie sua mensagem abaixo:
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField label="Nome" fullWidth margin="normal" />
        <TextField label="Email" fullWidth margin="normal" />
        <TextField label="Mensagem" fullWidth multiline rows={4} margin="normal" />
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>
          Enviar
        </Button>
      </Box>
    </Container>
  )
}
