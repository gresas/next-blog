import { PrismaClient } from '../../../generated/prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const noticia = await prisma.noticia.findUnique({
    where: { id: Number(params.id) }
  })

  if (!noticia) {
    return NextResponse.json({ error: 'Notícia não encontrada' }, { status: 404 })
  }

  return NextResponse.json(noticia)
}
