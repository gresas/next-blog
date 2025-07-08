import { NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nome, email, mensagem } = body

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    const contato = await prisma.contato.create({
      data: {
        nome,
        email,
        mensagem,
      },
    })

    return NextResponse.json(contato, { status: 201 })
  } catch (error) {
    console.error('[ERRO_CONTATO_POST]', error)
    return NextResponse.json(
      { message: 'Erro interno ao enviar contato.' },
      { status: 500 }
    )
  }
}
