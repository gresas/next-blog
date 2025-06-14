'use client'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'
import Navbar from './components/Navbar'

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
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
