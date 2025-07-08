import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '../../generated/prisma/client'
import { parse, serialize } from 'cookie'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

function generateAccessToken(user: { id: number; email: string }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
  const refreshToken = cookies.refresh_token

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token não fornecido' })
  }

  try {
    // Verifica se o refresh token está no banco e não expirou
    const tokenEntry = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    })

    if (!tokenEntry) {
      return res.status(401).json({ message: 'Refresh token inválido' })
    }

    if (new Date() > tokenEntry.expiresAt) {
      // Expirou, delete do DB
      await prisma.refreshToken.delete({ where: { token: refreshToken } })
      return res.status(401).json({ message: 'Refresh token expirado' })
    }

    // Gera novo access token
    const accessToken = generateAccessToken({ id: tokenEntry.user.id, email: tokenEntry.user.email })

    res.setHeader('Set-Cookie', serialize('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 15 * 60,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }))

    return res.status(200).json({ message: 'Token atualizado' })
  } catch (error) {
    return res.status(500).json({ message: 'Erro interno' })
  }
}
