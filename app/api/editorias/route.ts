import { NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const editorias = await prisma.editoria.findMany({
      orderBy: { nome: 'asc' },
      select: { id: true, nome: true },
    })
    return NextResponse.json(editorias)
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar editorias' }, { status: 500 })
  }
}
