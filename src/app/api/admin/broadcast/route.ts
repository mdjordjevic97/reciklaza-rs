import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sanitizeText } from '@/lib/utils/sanitize'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.isAdmin) return NextResponse.json({ error: 'Zabranjen pristup.' }, { status: 403 })

  try {
    const { content } = await request.json()
    if (!content?.trim()) return NextResponse.json({ error: 'Poruka ne može biti prazna.' }, { status: 400 })

    const sanitized = sanitizeText(content.trim())
    const users = await prisma.user.findMany({
      where: { isAdmin: false },
      select: { id: true },
    })

    let sent = 0
    for (const user of users) {
      const [p1, p2] = [session.user.id, user.id].sort()

      let conversation = await prisma.conversation.findFirst({
        where: { participant1Id: p1, participant2Id: p2, listingId: null },
      })

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: { participant1Id: p1, participant2Id: p2 },
        })
      }

      await prisma.message.create({
        data: { conversationId: conversation.id, senderId: session.user.id, content: sanitized },
      })

      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      })

      sent++
    }

    return NextResponse.json({ success: true, sent })
  } catch (error) {
    console.error('Broadcast error:', error)
    return NextResponse.json({ error: 'Greška pri slanju.' }, { status: 500 })
  }
}
