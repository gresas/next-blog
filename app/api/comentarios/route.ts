import { NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { nome, content, noticiaId } = body

    if (!nome || !content || !noticiaId) {
      return NextResponse.json({ error: 'Dados obrigatórios faltando.' }, { status: 400 })
    }

    // Verifica ou cria o usuário
    let usuario = await prisma.usuario.findFirst({
      where: { nome },
    })

    if (!usuario) {
      usuario = await prisma.usuario.create({
        data: {
          nome,
          email: `${nome.toLowerCase().replace(/\s+/g, '')}@example.com`, // gerando email fake
          senhaHash: '', // necessário pois é obrigatório
        },
      })
    }

    // Cria o comentário
    const novoComentario = await prisma.comentarios.create({
      data: {
        content,
        noticia: { connect: { id: noticiaId } },
        usuario: { connect: { id: usuario.id } },
      },
    })

    return NextResponse.json(novoComentario, { status: 201 })
  } catch (error) {
    console.error('[ERRO_COMENTARIO_POST]', error)
    return NextResponse.json({ error: 'Erro interno ao criar comentário.' }, { status: 500 })
  }
}
