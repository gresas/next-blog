import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import EditorNoticia from './page'

// Mock do cookie de autenticação
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: 'access_token=tokenvalido',
})

// Mock do contexto de autenticação
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    loading: false,
    user: {
      id: 1,
      nome: 'Usuário Teste',
      email: 'teste@teste.com',
      role: 'admin',
    },
    login: jest.fn(),
    logout: jest.fn(),
  }),
}))

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

// Mock do ProtectedRoute
jest.mock('../context/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: any) => <>{children}</>,
}))

// Mock do helpers de roles
jest.mock('../generated/helpers', () => ['admin', 'editor'])

describe('EditorNoticia', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn()
      // Primeira chamada: editorias
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, nome: 'Política' }],
      })
      // Segunda chamada: publicação
      .mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 }),
      })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o formulário de nova notícia', async () => {
    render(<EditorNoticia />)
    expect(await screen.findByLabelText(/Título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Autor/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Linha de Suporte/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Deck/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Editoria/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Corpo da Notícia/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Publicar Notícia/i })).toBeInTheDocument()
  })

  it('exibe erro se tentar publicar sem editoria', async () => {
    render(<EditorNoticia />)
    fireEvent.change(await screen.findByLabelText(/Título/i), { target: { value: 'Teste' } })
    fireEvent.click(screen.getByRole('button', { name: /Publicar Notícia/i }))
    expect(await screen.findByText(/selecionar uma editoria/i)).toBeInTheDocument()
  })

  it('publica notícia com sucesso', async () => {
    render(<EditorNoticia />)
    fireEvent.change(await screen.findByLabelText(/Título/i), { target: { value: 'Teste' } })
    fireEvent.change(screen.getByLabelText(/Autor/i), { target: { value: 'Autor' } })
    fireEvent.change(screen.getByLabelText(/Linha de Suporte/i), { target: { value: 'Linha' } })
    fireEvent.change(screen.getByLabelText(/Deck/i), { target: { value: 'Resumo' } })
    fireEvent.change(screen.getByLabelText(/Corpo da Notícia/i), { target: { value: 'Conteúdo' } })

    // Simula seleção do Autocomplete
    const editoriaInput = screen.getByRole('combobox')
    fireEvent.mouseDown(editoriaInput)
    const option = await screen.findByText('Política')
    fireEvent.click(option)

    fireEvent.click(screen.getByRole('button', { name: /Publicar Notícia/i }))

    await waitFor(() => {
      expect((global.fetch as jest.Mock)).toHaveBeenCalled()
      const calls = (global.fetch as jest.Mock).mock.calls
      const call = calls.find(
        ([url]: any[]) => typeof url === 'string' && url.includes('/api/noticias')
      )
      expect(call).toBeTruthy()
      expect(call?.[1]?.method).toBe('POST')
    })
  })
})
