import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/utils/sanitize'

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.isAdmin) return null
  return session
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })
  const { id } = await params

  try {
    const body = await request.json()

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title: body.title ? sanitizeText(body.title) : undefined,
        description: body.description ? sanitizeText(body.description) : undefined,
        wasteIndexNumber: body.wasteIndexNumber || undefined,
        wasteCategory: body.wasteCategory || undefined,
        wasteSubcategory: body.wasteSubcategory !== undefined ? (body.wasteSubcategory || null) : undefined,
        isHazardous: body.isHazardous ?? undefined,
        quantity: body.quantity ?? undefined,
        unit: body.unit || undefined,
        pricePerUnit: body.pricePerUnit !== undefined ? body.pricePerUnit : undefined,
        municipality: body.municipality || undefined,
        address: body.address !== undefined ? (body.address ? sanitizeText(body.address) : null) : undefined,
        status: body.status || undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin update listing error:', error)
    return NextResponse.json({ error: 'Greška pri ažuriranju.' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })
  const { id } = await params

  await prisma.listing.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
