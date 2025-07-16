import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'


const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET!

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10
  const skip = (page - 1) * pageSize

  const noticias = await prisma.noticia.findMany({
    skip,
    take: pageSize,
    include: {
      createdBy: true
    },
    orderBy: {
      firstPublishAt: 'desc'
    }
  })

  const total = await prisma.noticia.count()

  return NextResponse.json({ noticias, total })
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access_token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
  }

  let userId: number

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: number }
    userId = payload.id
  } catch (err) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 403 })
  }

  const body = await req.json()

  const { titulo, deck, linhaSuporte, autor, corpo, editoriaId, tags } = body

  if (!titulo || !deck || !linhaSuporte || !corpo) {
    return NextResponse.json({ message: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  try {
    const noticia = await prisma.noticia.create({
      data: {
        titulo,
        deck,
        linhaSuporte,
        corpo,
        autor,
        createdBy: { connect: { id: userId } },
        editoria: editoriaId ? { connect: { id: editoriaId } } : undefined,
        tags: tags && Array.isArray(tags)
          ? {
              connectOrCreate: tags.map((tag: string) => ({
                where: { nome: tag },
                create: { nome: tag },
              })),
            }
          : undefined,
      },
    })

    return NextResponse.json(noticia, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar notícia:', error)
    return NextResponse.json({ message: 'Erro interno ao criar notícia' }, { status: 500 })
  }
}
