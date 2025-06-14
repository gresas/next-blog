'use client'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import Link from 'next/link'

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
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
