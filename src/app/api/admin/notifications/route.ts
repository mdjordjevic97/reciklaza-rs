import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  const { searchParams } = new URL(request.url)
  const unreadOnly = searchParams.get('unread') === 'true'

  const notifications = await prisma.adminNotification.findMany({
    where: unreadOnly ? { read: false } : {},
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const unreadCount = await prisma.adminNotification.count({ where: { read: false } })

  return NextResponse.json({ notifications, unreadCount })
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  const { id, readAll } = await request.json()

  if (readAll) {
    await prisma.adminNotification.updateMany({ where: { read: false }, data: { read: true } })
  } else if (id) {
    await prisma.adminNotification.update({ where: { id }, data: { read: true } })
  }

  return NextResponse.json({ success: true })
}
