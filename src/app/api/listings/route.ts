import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/utils/sanitize'
import { listingSchema } from '@/lib/validations/listing'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const subcategory = searchParams.get('subcategory')
  const municipality = searchParams.get('municipality')
  const hazardous = searchParams.get('hazardous')
  const search = searchParams.get('search')
  const userId = searchParams.get('userId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = 12

  const where: Record<string, unknown> = userId ? { userId } : { status: 'ACTIVE' }
  if (category) where.wasteCategory = category
  if (subcategory) where.wasteSubcategory = subcategory
  if (municipality) where.municipality = municipality
  if (hazardous === 'true') where.isHazardous = true
  if (hazardous === 'false') where.isHazardous = false
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { wasteIndexNumber: { contains: search } },
    ]
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        user: { select: { id: true, companyName: true, city: true, userType: true, avatarUrl: true, verified: true } },
        images: { orderBy: { displayOrder: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ])

  return NextResponse.json({ listings, total, pages: Math.ceil(total / limit), page })
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = rateLimit(`api:${ip}`, LIMITS.api.limit, LIMITS.api.window)
    if (!success) return NextResponse.json({ error: 'Previše zahteva.' }, { status: 429 })

    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { userType: true } })
    if (user?.userType !== 'GENERATOR') {
      return NextResponse.json({ error: 'Samo generatori otpada mogu postavljati oglase.' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = listingSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Nevažeći podaci.', details: parsed.error.flatten() }, { status: 400 })

    const data = parsed.data
    const listing = await prisma.listing.create({
      data: {
        userId: session.user.id,
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

    await prisma.adminNotification.create({
      data: {
        type: 'NEW_LISTING',
        title: 'Novi oglas',
        message: `${session.user.companyName} je objavio/la novi oglas: "${sanitizeText(data.title)}" (${data.wasteIndexNumber}) u opštini ${data.municipality}.${data.isHazardous ? ' ⚠️ OPASAN OTPAD' : ''}`,
        data: JSON.stringify({ listingId: listing.id, userId: session.user.id, title: data.title }),
      },
    })

    return NextResponse.json(listing, { status: 201 })
  } catch (error) {
    console.error('Create listing error:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju oglasa.' }, { status: 500 })
  }
}
