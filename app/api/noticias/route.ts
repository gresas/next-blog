import { NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(noticias)
}
