import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContatoPage from './page'

// Mock do hook de loading para não atrasar os testes
jest.mock('../hooks/FakeLoading', () => ({
  useFakeLoading: () => false,
}))

describe('ContatoPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o formulário de contato', () => {
    render(<ContatoPage />)
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Mensagem/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument()
  })

  it('envia mensagem com sucesso', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }) as any

    render(<ContatoPage />)
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@email.com' } })
    fireEvent.change(screen.getByLabelText(/Mensagem/i), { target: { value: 'Olá, tudo bem?' } })
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/Mensagem enviada com sucesso/i)).toBeInTheDocument()
  })

  it('exibe erro ao falhar envio', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Erro ao enviar mensagem' }),
    }) as any

    render(<ContatoPage />)
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'João' } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'joao@email.com' } })
    fireEvent.change(screen.getByLabelText(/Mensagem/i), { target: { value: 'Olá, tudo bem?' } })
    fireEvent.click(screen.getByRole('button', { name: /Enviar/i }))

    expect(await screen.findByText(/Erro ao enviar mensagem/i)).toBeInTheDocument()
  })
})
