import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

export function withAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const cookies = req.headers.cookie ? parse(req.headers.cookie) : {}
      const token = cookies.access_token
      if (!token) {
        return res.status(401).json({ message: 'Não autenticado' })
      }

      const decoded = jwt.verify(token, JWT_SECRET)
      // Pode passar dados do usuário no req
      ;(req as any).user = decoded

      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido ou expirado' })
    }
  }
}
