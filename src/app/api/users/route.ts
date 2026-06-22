import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const userType = searchParams.get('userType')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  const where: Record<string, unknown> = { id: { not: session.user.id } }
  if (city) where.city = city
  if (userType) where.userType = userType
  if (search) {
    where.OR = [
      { companyName: { contains: search } },
      { city: { contains: search } },
      { pib: { contains: search } },
    ]
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        companyName: true,
        city: true,
        userType: true,
        avatarUrl: true,
        verified: true,
        bio: true,
        createdAt: true,
        _count: { select: { listings: { where: { status: 'ACTIVE' } } } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({ users, total, pages: Math.ceil(total / limit), page })
}
