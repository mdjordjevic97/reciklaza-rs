'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bell, UserPlus, Package, CheckCheck, Eye } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { formatRelativeTime } from '@/lib/utils/format'

const typeIcons: Record<string, any> = {
  NEW_USER: UserPlus,
  NEW_LISTING: Package,
}

const typeColors: Record<string, string> = {
  NEW_USER: 'bg-blue-100 text-blue-600',
  NEW_LISTING: 'bg-amber-100 text-amber-600',
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = () => {
    fetch('/api/admin/notifications')
      .then(r => r.json())
      .then(data => { setNotifications(data.notifications || []); setLoading(false) })
  }

  useEffect(() => { fetchNotifications() }, [])

  const markAsRead = async (id: string) => {
    await fetch('/api/admin/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    await fetch('/api/admin/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readAll: true }),
    })
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getLink = (n: any) => {
    try {
      const data = n.data ? JSON.parse(n.data) : null
      if (n.type === 'NEW_USER' && data?.userId) return `/admin/korisnici/${data.userId}`
      if (n.type === 'NEW_LISTING' && data?.listingId) return `/admin/oglasi/${data.listingId}`
    } catch {}
    return null
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Obaveštenja</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck size={16} /> Označi sve kao pročitano
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nema obaveštenja</h3>
          <p className="text-gray-500 text-sm">Obaveštenja će se pojaviti kada se registruje novi korisnik ili objavi novi oglas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => {
            const Icon = typeIcons[n.type] || Bell
            const colorClass = typeColors[n.type] || 'bg-gray-100 text-gray-600'
            const link = getLink(n)

            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${
                  n.read ? 'bg-white border-gray-200' : 'bg-primary-50 border-primary-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${n.read ? 'text-gray-700' : 'font-semibold text-gray-900'}`}>{n.title}</p>
                    {!n.read && <span className="w-2 h-2 bg-primary-500 rounded-full shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</span>
                    {link && (
                      <Link href={link} className="text-xs text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1">
                        <Eye size={12} /> Pogledaj
                      </Link>
                    )}
                    {!n.read && (
                      <button onClick={() => markAsRead(n.id)} className="text-xs text-gray-400 hover:text-gray-600">
                        Označi kao pročitano
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
