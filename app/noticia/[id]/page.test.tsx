import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import PaginaNoticia from './page'

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '1' }),
  useRouter: () => ({ back: jest.fn() }),
}))

describe('PaginaNoticia', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('exibe loading enquanto carrega', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as any // Promise nunca resolve, simula loading
    render(<PaginaNoticia />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('exibe mensagem de erro se notícia não encontrada', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => null,
    }) as any

    render(<PaginaNoticia />)
    expect(await screen.findByText(/Notícia não encontrada/i)).toBeInTheDocument()
  })

  it('exibe notícia e comentários', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        id: 1,
        titulo: 'Título Teste',
        autor: 'Autor Teste',
        deck: 'Resumo Teste',
        linhaSuporte: 'Linha Suporte',
        corpo: 'Corpo da notícia',
        comentarios: [
          {
            id: 1,
            title: 'Comentário 1',
            content: 'Conteúdo do comentário',
            usuario: { nome: 'Usuário 1' }
          }
        ]
      }),
    }) as any

    render(<PaginaNoticia />)

    expect(await screen.findByText('Título Teste')).toBeInTheDocument()
    expect(screen.getByText('Por Autor Teste')).toBeInTheDocument()
    expect(screen.getByText('Resumo Teste')).toBeInTheDocument()
    expect(screen.getByText('Linha Suporte')).toBeInTheDocument()
    expect(screen.getByText('Corpo da notícia')).toBeInTheDocument()
    expect(screen.getByText('Comentário 1')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do comentário')).toBeInTheDocument()
    expect(screen.getByText(/Usuário 1/)).toBeInTheDocument()
  })

  it('exibe mensagem se não houver comentários', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => ({
        id: 1,
        titulo: 'Título Teste',
        autor: 'Autor Teste',
        deck: 'Resumo Teste',
        linhaSuporte: 'Linha Suporte',
        corpo: 'Corpo da notícia',
        comentarios: []
      }),
    }) as any

    render(<PaginaNoticia />)
    expect(await screen.findByText(/Nenhum comentário ainda/i)).toBeInTheDocument()
  })
})
