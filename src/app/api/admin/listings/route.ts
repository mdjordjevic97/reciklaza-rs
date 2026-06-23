import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
      { title: { contains: search } },
      { wasteIndexNumber: { contains: search } },
      { municipality: { contains: search } },
    ]
  }

  const listings = await prisma.listing.findMany({
    where,
    include: {
      user: { select: { id: true, companyName: true } },
      images: { take: 1, orderBy: { displayOrder: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(listings)
}

export async function POST(request: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  try {
    const body = await request.json()
    const { userId, title, description, wasteIndexNumber, wasteCategory, wasteSubcategory, isHazardous, quantity, unit, pricePerUnit, municipality, address } = body

    if (!userId || !title || !description || !wasteIndexNumber || !wasteCategory || !quantity || !municipality) {
      return NextResponse.json({ error: 'Sva obavezna polja moraju biti popunjena.' }, { status: 400 })
    }

    const listing = await prisma.listing.create({
      data: {
        userId,
        title: sanitizeText(title),
        description: sanitizeText(description),
        wasteIndexNumber,
        wasteCategory,
        wasteSubcategory: wasteSubcategory || null,
        isHazardous: isHazardous ?? false,
        quantity,
        unit: unit || 'kg',
        pricePerUnit: pricePerUnit ?? null,
        municipality,
        address: address ? sanitizeText(address) : null,
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Admin create listing error:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju oglasa.' }, { status: 500 })
  }
}
