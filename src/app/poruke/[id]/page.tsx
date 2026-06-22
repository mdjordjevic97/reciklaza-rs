'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Send, ChevronLeft, Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils/format'

export default function ChatPage() {
  const { id: conversationId } = useParams()
  const { data: session } = useSession()
  const [messages, setMessages] = useState<any[]>([])
  const [conversation, setConversation] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const lastTimestampRef = useRef<string>('')

  useEffect(() => {
    fetch(`/api/messages?conversationId=${conversationId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data)
          if (data.length > 0) lastTimestampRef.current = data[data.length - 1].createdAt
        }
        setLoading(false)
      })

    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const conv = data.find((c: any) => c.id === conversationId)
          if (conv) setConversation(conv)
        }
      })
  }, [conversationId])

  useEffect(() => {
    const interval = setInterval(async () => {
      const after = lastTimestampRef.current || ''
      const res = await fetch(`/api/messages?conversationId=${conversationId}${after ? `&after=${after}` : ''}`)
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id))
          const newMsgs = data.filter((m: any) => !existingIds.has(m.id))
          if (newMsgs.length === 0) return prev
          return [...prev, ...newMsgs]
        })
        lastTimestampRef.current = data[data.length - 1].createdAt
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const content = newMessage.trim()
    setNewMessage('')

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, content }),
      })
      const msg = await res.json()
      if (msg.id) {
        setMessages(prev => [...prev, msg])
        lastTimestampRef.current = msg.createdAt
      }
    } catch {
      setNewMessage(content)
    } finally {
      setSending(false)
    }
  }

  const getOtherUser = () => {
    if (!conversation) return null
    return conversation.participant1.id === session?.user?.id ? conversation.participant2 : conversation.participant1
  }

  const other = getOtherUser()

  return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-3">
            <Link href="/poruke" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
              <ChevronLeft size={20} />
            </Link>
            {other && (
              <Link href={`/profil/${other.id}`} className="flex items-center gap-3 hover:opacity-80">
                <Avatar name={other.companyName} size="sm" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{other.companyName}</p>
                  {conversation?.listing ? (
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Package size={10} /> {conversation.listing.title}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Direktna poruka</p>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-4">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size={32} /></div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-sm">Započnite razgovor slanjem poruke</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.senderId === session?.user?.id
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                    }`}>
                      <p className="text-sm whitespace-pre-line">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-primary-200' : 'text-gray-400'}`}>
                        {formatRelativeTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-3">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Napišite poruku..."
              maxLength={2000}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </>
  )
}
