import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../../../generated/prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, res: NextResponse) {
  const { nome, email, userId } = await req.json()

  if (!nome || !email || !userId) {
    return NextResponse.json(
      { message: 'Campos obrigatórios não preenchidos' },
      { status: 400 }
    )
  }
  
  const existingUser = await prisma.usuario.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json(
      { message: 'Email já está em uso' },
      { status: 400 }
    );
  }

  await prisma.usuario.update({
    where: { id: userId },
    data: {
      nome,
      email
    }
  })

  return NextResponse.json(
    { message: 'Usuário editado com sucesso' },
    { status: 201 }
  ) 
}
