import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendApprovalEmail } from '@/lib/email'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  const { id } = await params

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })

  await prisma.user.update({ where: { id }, data: { verified: true } })

  try {
    await sendApprovalEmail(user.email, user.companyName)
  } catch (e) {
    console.error('Approval email error:', e)
  }

  return NextResponse.json({ success: true })
}
