import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const profile = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      companyName: true,
      pib: true,
      address: true,
      city: true,
      contactPerson: true,
      phone: true,
      userType: true,
      avatarUrl: true,
      bio: true,
      wasteCategories: true,
      verified: true,
      createdAt: true,
    },
  })

  if (!profile) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })

  return NextResponse.json(profile)
}
