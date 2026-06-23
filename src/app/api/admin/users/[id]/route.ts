import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/utils/sanitize'
import { sendApprovalEmail } from '@/lib/email'

async function checkAdmin() {
  const session = await auth()
  if (!session?.user?.isAdmin) return null
  return session
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    include: { permits: true, _count: { select: { listings: true } } },
  })

  if (!user) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })
  const { id } = await params

  try {
    const body = await request.json()

    const existingUser = await prisma.user.findUnique({ where: { id } })
    if (!existingUser) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })

    const wasVerified = existingUser.verified
    const willBeVerified = body.verified ?? existingUser.verified

    const updated = await prisma.user.update({
      where: { id },
      data: {
        companyName: body.companyName ? sanitizeText(body.companyName) : undefined,
        address: body.address ? sanitizeText(body.address) : undefined,
        city: body.city || undefined,
        contactPerson: body.contactPerson ? sanitizeText(body.contactPerson) : undefined,
        phone: body.phone ?? undefined,
        userType: body.userType || undefined,
        verified: body.verified ?? undefined,
        bio: body.bio !== undefined ? (body.bio ? sanitizeText(body.bio) : null) : undefined,
      },
    })

    if (!wasVerified && willBeVerified) {
      try { await sendApprovalEmail(updated.email, updated.companyName) } catch (e) { console.error('Approval email error:', e) }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Admin update user error:', error)
    return NextResponse.json({ error: 'Greška pri ažuriranju.' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })
  const { id } = await params

  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
