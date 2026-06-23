import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/utils/sanitize'
import { listingSchema } from '@/lib/validations/listing'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, companyName: true, city: true, userType: true, avatarUrl: true, verified: true, createdAt: true } },
      images: { orderBy: { displayOrder: 'asc' } },
    },
  })

  if (!listing) return NextResponse.json({ error: 'Oglas nije pronađen.' }, { status: 404 })

  await prisma.listing.update({ where: { id }, data: { viewsCount: { increment: 1 } } })

  return NextResponse.json(listing)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const listing = await prisma.listing.findUnique({ where: { id } })
    if (!listing) return NextResponse.json({ error: 'Oglas nije pronađen.' }, { status: 404 })
    if (listing.userId !== session.user.id) return NextResponse.json({ error: 'Nemate dozvolu.' }, { status: 403 })

    const body = await request.json()
    const parsed = listingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Nevažeći podaci.', details: parsed.error.flatten() }, { status: 400 })

    const data = parsed.data
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: sanitizeText(data.title),
        description: sanitizeText(data.description),
        wasteIndexNumber: data.wasteIndexNumber,
        wasteCategory: data.wasteCategory,
        wasteSubcategory: data.wasteSubcategory || null,
        isHazardous: data.isHazardous,
        quantity: data.quantity,
        unit: data.unit,
        pricePerUnit: data.pricePerUnit,
        municipality: data.municipality,
        address: data.address ? sanitizeText(data.address) : null,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Update listing error:', error)
    return NextResponse.json({ error: 'Greška pri izmeni oglasa.' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const listing = await prisma.listing.findUnique({ where: { id } })
    if (!listing) return NextResponse.json({ error: 'Oglas nije pronađen.' }, { status: 404 })
    if (listing.userId !== session.user.id) return NextResponse.json({ error: 'Nemate dozvolu.' }, { status: 403 })

    await prisma.listing.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete listing error:', error)
    return NextResponse.json({ error: 'Greška pri brisanju oglasa.' }, { status: 500 })
  }
}
