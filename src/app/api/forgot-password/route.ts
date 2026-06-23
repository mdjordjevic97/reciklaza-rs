import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { generateCode, sendPasswordResetEmail } from '@/lib/email'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = rateLimit(`auth:${ip}`, LIMITS.auth.limit, LIMITS.auth.window)
  if (!success) return NextResponse.json({ error: 'Previše pokušaja.' }, { status: 429 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email je obavezan.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ success: true })

  await prisma.verificationCode.updateMany({
    where: { email, type: 'PASSWORD_RESET', used: false },
    data: { used: true },
  })

  const code = generateCode()
  await prisma.verificationCode.create({
    data: { email, code, type: 'PASSWORD_RESET', expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
  })

  try { await sendPasswordResetEmail(email, code) } catch (e) { console.error('Reset email error:', e) }

  return NextResponse.json({ success: true })
}

export async function PUT(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = rateLimit(`auth:${ip}`, LIMITS.auth.limit, LIMITS.auth.window)
  if (!success) return NextResponse.json({ error: 'Previše pokušaja.' }, { status: 429 })

  const { email, code, newPassword } = await request.json()
  if (!email || !code || !newPassword) return NextResponse.json({ error: 'Sva polja su obavezna.' }, { status: 400 })
  if (newPassword.length < 8) return NextResponse.json({ error: 'Lozinka mora imati najmanje 8 karaktera.' }, { status: 400 })

  const verification = await prisma.verificationCode.findFirst({
    where: { email, code, type: 'PASSWORD_RESET', used: false, expiresAt: { gt: new Date() } },
  })

  if (!verification) return NextResponse.json({ error: 'Nevažeći ili istekao kod.' }, { status: 400 })

  await prisma.verificationCode.update({ where: { id: verification.id }, data: { used: true } })
  await prisma.user.update({ where: { email }, data: { passwordHash: await bcrypt.hash(newPassword, 12) } })

  return NextResponse.json({ success: true })
}
