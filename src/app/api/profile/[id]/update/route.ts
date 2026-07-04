import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/utils/sanitize'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session?.user || session.user.id !== id) {
      return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })
    }

    const body = await request.json()

    const updated = await prisma.user.update({
      where: { id },
      data: {
        companyName: sanitizeText(body.companyName || ''),
        address: sanitizeText(body.address || ''),
        city: body.city || '',
        contactPerson: sanitizeText(body.contactPerson || ''),
        phone: body.phone || null,
        bio: body.bio ? sanitizeText(body.bio) : null,
        wasteCategories: Array.isArray(body.wasteCategories) ? JSON.stringify(body.wasteCategories) : null,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Greška pri ažuriranju.' }, { status: 500 })
  }
}
