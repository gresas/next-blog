'use client'
import { Box, Container, Typography, IconButton, Stack } from '@mui/material'
import InstagramIcon from '@mui/icons-material/Instagram'
import GitHubIcon from '@mui/icons-material/GitHub'

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', py: 2, mt: 4, color: 'white' }}>
      <Container maxWidth="lg">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ flexWrap: 'wrap', textAlign: 'center' }}
        >
          {/* Esquerda: Nome do criador */}
          <Typography variant="body2" sx={{ minWidth: '33%', textAlign: 'left' }}>
            Rondon's Blog
          </Typography>

          {/* Centro: Direitos reservados */}
          <Typography variant="body2" sx={{ minWidth: '33%', textAlign: 'center' }}>
            Todos os direitos reservados ®
          </Typography>

          {/* Direita: Ícones sociais */}
          <Stack direction="row" spacing={1} sx={{ minWidth: '33%', justifyContent: 'flex-end' }}>
            <IconButton
              aria-label="Instagram"
              href="https://instagram.com/gbrondon"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'white' }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              aria-label="GitHub"
              href="https://github.com/gresas"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'white' }}
            >
              <GitHubIcon />
            </IconButton>
          </Stack>
        </Stack>
      </Container>
    </Box>
  )
}
