import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { generateCode, sendVerificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = rateLimit(`auth:${ip}`, LIMITS.auth.limit, LIMITS.auth.window)
  if (!success) return NextResponse.json({ error: 'Previše pokušaja.' }, { status: 429 })

  const { email, code } = await request.json()
  if (!email || !code) return NextResponse.json({ error: 'Email i kod su obavezni.' }, { status: 400 })

  const verification = await prisma.verificationCode.findFirst({
    where: { email, code, type: 'EMAIL_VERIFY', used: false, expiresAt: { gt: new Date() } },
  })

  if (!verification) return NextResponse.json({ error: 'Nevažeći ili istekao kod.' }, { status: 400 })

  await prisma.verificationCode.update({ where: { id: verification.id }, data: { used: true } })
  await prisma.user.update({ where: { email }, data: { emailVerified: true } })

  return NextResponse.json({ success: true })
}

export async function PUT(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success } = rateLimit(`auth:${ip}`, LIMITS.auth.limit, LIMITS.auth.window)
  if (!success) return NextResponse.json({ error: 'Previše pokušaja.' }, { status: 429 })

  const { email } = await request.json()
  if (!email) return NextResponse.json({ error: 'Email je obavezan.' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })
  if (user.emailVerified) return NextResponse.json({ error: 'Email je već verifikovan.' }, { status: 400 })

  await prisma.verificationCode.updateMany({
    where: { email, type: 'EMAIL_VERIFY', used: false },
    data: { used: true },
  })

  const code = generateCode()
  await prisma.verificationCode.create({
    data: { email, code, type: 'EMAIL_VERIFY', expiresAt: new Date(Date.now() + 15 * 60 * 1000) },
  })

  try { await sendVerificationEmail(email, code) } catch (e) { console.error('Resend email error:', e) }

  return NextResponse.json({ success: true })
}
