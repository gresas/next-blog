'use client'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          Rondon's Blog
        </Typography>
        <Box>
          <Button color="inherit" component={Link} href="/">Início</Button>
          <Button color="inherit" component={Link} href="/contato">Contato</Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
