import { NextResponse } from 'next/server'
import { PrismaClient } from '../../generated/prisma/client'
const prisma = new PrismaClient()

export async function GET(req: Request) {
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
