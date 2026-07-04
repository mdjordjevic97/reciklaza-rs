import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { unlink } from 'fs/promises'
import { join } from 'path'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const { id } = await params
  const permit = await prisma.permit.findUnique({ where: { id } })

  if (!permit) return NextResponse.json({ error: 'Dozvola nije pronađena.' }, { status: 404 })
  if (permit.userId !== session.user.id && !session.user.isAdmin) {
    return NextResponse.json({ error: 'Nemate dozvolu.' }, { status: 403 })
  }

  try {
    const filePath = join(process.cwd(), 'public', permit.fileUrl)
    await unlink(filePath)
  } catch { /* fajl možda ne postoji */ }

  await prisma.permit.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
