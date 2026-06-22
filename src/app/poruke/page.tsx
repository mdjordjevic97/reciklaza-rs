'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MessageSquare, ChevronRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils/format'

export default function InboxPage() {
  const { data: session } = useSession()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/conversations')
      .then(r => r.json())
      .then(data => { setConversations(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))

    const interval = setInterval(() => {
      fetch('/api/conversations')
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setConversations(data) })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getOtherUser = (conv: any) => {
    return conv.participant1.id === session?.user?.id ? conv.participant2 : conv.participant1
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Poruke</h1>
            <p className="text-primary-100 mt-2">Vaši razgovori sa drugim korisnicima</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={32} /></div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Nemate poruke</h3>
              <p className="text-gray-500 text-sm mb-6">Pošaljite prvu poruku tako što ćete kontaktirati korisnika sa nekog oglasa.</p>
              <Link href="/oglasi" className="text-primary-600 font-semibold hover:text-primary-700">Pregledaj oglase</Link>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conv) => {
                const other = getOtherUser(conv)
                const lastMsg = conv.messages[0]
                const hasUnread = conv.unreadCount > 0

                return (
                  <Link
                    key={conv.id}
                    href={`/poruke/${conv.id}`}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors ${
                      hasUnread ? 'bg-primary-50 border-primary-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Avatar name={other.companyName} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                          {other.companyName}
                        </p>
                        {lastMsg && (
                          <span className="text-xs text-gray-400 shrink-0 ml-2">
                            {formatRelativeTime(lastMsg.createdAt)}
                          </span>
                        )}
                      </div>
                      {conv.listing && (
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {conv.listing.title}
                        </p>
                      )}
                      {lastMsg && (
                        <p className={`text-sm truncate mt-1 ${hasUnread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                          {lastMsg.senderId === session?.user?.id && <span className="text-gray-400">Vi: </span>}
                          {lastMsg.content}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {hasUnread && (
                        <span className="w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
