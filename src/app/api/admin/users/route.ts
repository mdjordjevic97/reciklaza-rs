import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sanitizeText } from '@/lib/utils/sanitize'

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.isAdmin) return null
  return session
}

export async function GET(request: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')

  const where: Record<string, unknown> = {}
  if (search) {
    where.OR = [
      { companyName: { contains: search } },
      { email: { contains: search } },
      { pib: { contains: search } },
      { city: { contains: search } },
    ]
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true, email: true, companyName: true, pib: true, city: true, contactPerson: true,
      phone: true, userType: true, verified: true, isAdmin: true, createdAt: true,
      _count: { select: { listings: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(users)
}

export async function POST(request: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  try {
    const body = await request.json()
    const { email, password, companyName, pib, address, city, contactPerson, phone, userType, verified } = body

    if (!email || !password || !companyName || !pib || !address || !city || !contactPerson || !userType) {
      return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena.' }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { pib }] } })
    if (existing) return NextResponse.json({ error: 'Email ili PIB već postoji.' }, { status: 409 })

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: await bcrypt.hash(password, 12),
        companyName: sanitizeText(companyName),
        pib,
        address: sanitizeText(address),
        city,
        contactPerson: sanitizeText(contactPerson),
        phone: phone || null,
        userType,
        verified: verified ?? false,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Admin create user error:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju korisnika.' }, { status: 500 })
  }
}
