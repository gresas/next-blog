// /pages/api/login.ts  (ou /app/api/login/route.ts no app router)

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../generated/prisma/client'
import { cookies } from 'next/headers'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

function generateAccessToken(user: { id: number; email: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' })
}

function generateRefreshToken() {
  return require('crypto').randomBytes(40).toString('hex')
}

export async function POST(req: NextRequest, res: NextResponse) {
  const { email, senha } = await req.json()
  const cookieStore = await cookies()

  if (!email || !senha) return NextResponse.json(
    { message: 'Email e senha obrigatórios'},
    { status: 400 }
  )

  try {
    const user = await prisma.usuario.findUnique({ where: { email } })
    if (!user) return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
    )

    const validPassword = await bcrypt.compare(senha, user.senhaHash)
    if (!validPassword) return NextResponse.json(
        { message: 'Credenciais inválidas' },
        { status: 401 }
    )

    const accessToken = generateAccessToken({ id: user.id, email: user.email })
    const refreshToken = generateRefreshToken()

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
      },
    })

    cookieStore.set('access_token', accessToken, {
        httpOnly: true,
        path: '/',
        maxAge: 15 * 60,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })
    
    cookieStore.set('refresh_token', refreshToken, {
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    })

    return NextResponse.json(
        { message: 'Login realizado com sucesso' },
        { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
        { message: 'Erro interno' },
        { status: 500 }
    )
  }
}
