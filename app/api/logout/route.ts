import { NextResponse } from 'next/server'

export async function POST() {
  // Para logout, limpe o cookie do token
  const response = NextResponse.json({ message: 'Logout realizado' })

  response.cookies.set({
    name: 'access_token',
    value: '',
    path: '/',
    maxAge: 0, // expira imediatamente
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return response
}
