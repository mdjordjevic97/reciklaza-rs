import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  const { id } = await params
  const { status } = await request.json()

  if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
    return NextResponse.json({ error: 'Nevalidan status.' }, { status: 400 })
  }

  const permit = await prisma.permit.update({
    where: { id },
    data: { status, reviewedAt: new Date() },
  })

  return NextResponse.json(permit)
}
