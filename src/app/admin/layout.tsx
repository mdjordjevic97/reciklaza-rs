'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Users, Package, MessageSquare, ChevronLeft, Bell } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: Shield },
  { href: '/admin/obavestenja', label: 'Obaveštenja', icon: Bell, hasBadge: true },
  { href: '/admin/korisnici', label: 'Korisnici', icon: Users },
  { href: '/admin/oglasi', label: 'Oglasi', icon: Package },
  { href: '/admin/poruka-svima', label: 'Poruka svima', icon: MessageSquare },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = () => {
      fetch('/api/admin/notifications?unread=true')
        .then(r => r.json())
        .then(data => setUnreadCount(data.unreadCount || 0))
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Navbar />
      <div className="flex-1 flex">
        <aside className="w-56 bg-gray-900 text-gray-300 shrink-0 hidden lg:block">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 text-white font-bold">
              <Shield size={18} className="text-primary-400" />
              Admin Panel
            </div>
          </div>
          <nav className="p-2 space-y-0.5">
            {adminLinks.map(({ href, label, icon: Icon, hasBadge }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href ? 'bg-primary-600 text-white' : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
                {hasBadge && unreadCount > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="p-2 mt-4">
            <Link href="/oglasi" className="flex items-center gap-2 px-3 py-2 text-xs text-gray-500 hover:text-gray-300">
              <ChevronLeft size={14} /> Nazad na sajt
            </Link>
          </div>
        </aside>
        <main className="flex-1 bg-gray-50 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </>
  )
}
