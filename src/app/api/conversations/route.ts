import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit, LIMITS } from '@/lib/rate-limit'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

  const userId = session.user.id

  const dbUser = await prisma.user.findUnique({ where: { id: userId } })
  if (!dbUser) return NextResponse.json([], { status: 200 })

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [
        { participant1Id: userId },
        { participant2Id: userId },
      ],
    },
    include: {
      listing: { select: { id: true, title: true, wasteIndexNumber: true } },
      participant1: { select: { id: true, companyName: true, avatarUrl: true } },
      participant2: { select: { id: true, companyName: true, avatarUrl: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: { content: true, createdAt: true, senderId: true, read: true },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  const withUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unreadCount = await prisma.message.count({
        where: {
          conversationId: conv.id,
          senderId: { not: userId },
          read: false,
        },
      })
      return { ...conv, unreadCount }
    })
  )

  return NextResponse.json(withUnread)
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = rateLimit(`api:${ip}`, LIMITS.api.limit, LIMITS.api.window)
    if (!success) return NextResponse.json({ error: 'Previše zahteva.' }, { status: 429 })

    const session = await auth()
    if (!session?.user) return NextResponse.json({ error: 'Neautorizovano.' }, { status: 401 })

    const { listingId, otherUserId } = await request.json()
    if (!otherUserId) return NextResponse.json({ error: 'Nedostaju podaci.' }, { status: 400 })
    if (otherUserId === session.user.id) return NextResponse.json({ error: 'Ne možete slati poruke sebi.' }, { status: 400 })

    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id } })
    if (!currentUser) return NextResponse.json({ error: 'Vaš nalog nije pronađen. Odjavite se i prijavite ponovo.' }, { status: 401 })

    const otherUser = await prisma.user.findUnique({ where: { id: otherUserId } })
    if (!otherUser) return NextResponse.json({ error: 'Korisnik nije pronađen.' }, { status: 404 })

    const [p1, p2] = [session.user.id, otherUserId].sort()

    const existing = await prisma.conversation.findFirst({
      where: {
        participant1Id: p1,
        participant2Id: p2,
        ...(listingId ? { listingId } : { listingId: null }),
      },
    })

    if (existing) return NextResponse.json(existing)

    const conversation = await prisma.conversation.create({
      data: { listingId: listingId || null, participant1Id: p1, participant2Id: p2 },
    })

    return NextResponse.json(conversation, { status: 201 })
  } catch (error) {
    console.error('Create conversation error:', error)
    return NextResponse.json({ error: 'Greška pri kreiranju konverzacije.' }, { status: 500 })
  }
}
