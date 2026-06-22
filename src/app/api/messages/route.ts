import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'
import { sanitizeText } from '@/lib/utils/sanitize'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const conversationId = searchParams.get('conversationId')
  const after = searchParams.get('after')

  if (!conversationId) return NextResponse.json({ error: 'ID konverzacije je obavezan.' }, { status: 400 })

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [
        { participant1Id: session.user.id },
        { participant2Id: session.user.id },
      ],
    },
  })

  if (!conversation) return NextResponse.json({ error: 'Konverzacija nije pronađena.' }, { status: 404 })

  const where: Record<string, unknown> = { conversationId }
  if (after) where.createdAt = { gt: new Date(after) }

  const messages = await prisma.message.findMany({
    where,
    include: { sender: { select: { id: true, companyName: true, avatarUrl: true } } },
    orderBy: { createdAt: 'asc' },
  })

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      read: false,
    },
    data: { read: true },
  })

  return NextResponse.json(messages)
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = rateLimit(`msg:${ip}`, LIMITS.message.limit, LIMITS.message.window)
    if (!success) return NextResponse.json({ error: 'Previše poruka. Sačekajte minut.' }, { status: 429 })

    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const { conversationId, content } = await request.json()
    if (!conversationId || !content?.trim()) return NextResponse.json({ error: 'Poruka ne može biti prazna.' }, { status: 400 })
    if (content.length > 2000) return NextResponse.json({ error: 'Poruka je predugačka.' }, { status: 400 })

    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participant1Id: session.user.id },
          { participant2Id: session.user.id },
        ],
      },
    })

    if (!conversation) return NextResponse.json({ error: 'Konverzacija nije pronađena.' }, { status: 404 })

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        content: sanitizeText(content.trim()),
      },
      include: { sender: { select: { id: true, companyName: true, avatarUrl: true } } },
    })

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Greška pri slanju poruke.' }, { status: 500 })
  }
}
