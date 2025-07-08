import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  const cookieStore = await cookies()
  const access_cookie = cookieStore.get('access_token')?.value || ''
  const refresh_cookie = cookieStore.get('refresh_cookie')?.value || ''
  
  const token = access_cookie
    .split(';')
    .find(c => c.trim().startsWith('access_token='))?.split('=')[1]

  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({ authenticated: true, user: payload })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
