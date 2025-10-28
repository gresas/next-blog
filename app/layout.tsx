'use client'
import React from 'react'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import { useEffect, useMemo } from 'react'
import Navbar from './components/navbar/Navbar'
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext'


export function TokenRefresher() {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/refresh', { method: 'POST' })
        if (!res.ok) {
          // Pode tratar logout automático aqui, por exemplo
          console.log('Falha ao atualizar token')
        } else {
          console.log('Token atualizado')
        }
      } catch (error) {
        console.log('Erro no refresh:', error)
      }
    }, 15 * 60 * 1000) // 15 minutos

    return () => clearInterval(interval)
  }, [])

  return null
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useMemo(() => 
    createTheme({
      palette: {
        primary: { main: '#0057B8' },
        secondary: { main: '#FF5C00' },
        background: { default: '#F5F5F5' },
      },
    }),
    []
  )
  
  return (
    <html lang="pt-br">
      <body style={{ margin: 0 }}>
        <AuthProvider>
        <TokenRefresher />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
          <main style={{ flexGrow: 1, paddingBottom: '50px' }}>
            {children}
          </main>
            <div style={{ marginTop: '100px' }}>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
