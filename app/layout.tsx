'use client'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const theme = createTheme({
  palette: {
    primary: { main: '#0057B8' },
    secondary: { main: '#FF5C00' },
    background: { default: '#F5F5F5' },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body style={{ margin: 0 }}>
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
          <main style={{ flexGrow: 1, paddingBottom: '150px' }}>
            {children}
          </main>
            <div style={{ marginTop: '100px' }}>
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
