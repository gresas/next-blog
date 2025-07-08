import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { PrismaClient } from '../../generated/prisma/client'

const prisma = new PrismaClient()

export async function POST(req: NextRequest, res: NextResponse) {
  const { nome, email, senha } = await req.json()

  if (!nome || !email || !senha) {
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

  const senhaHash = await bcrypt.hash(senha, 10)
  await prisma.usuario.create({
    data: {
      nome,
      email,
      senhaHash,
      role: 'USER',
    }
  })

  return NextResponse.json(
    { message: 'Usuário criado com sucesso' },
    { status: 201 }
  ) 
}
