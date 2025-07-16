import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../generated/prisma/client'

const JWT_SECRET = process.env.JWT_SECRET!
const prisma = new PrismaClient()


export async function GET(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Não autenticado' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number, email: string }

    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true
      }
    })

    if (!user) {
      return NextResponse.json({ message: 'Usuário não encontrado' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
  }
}
