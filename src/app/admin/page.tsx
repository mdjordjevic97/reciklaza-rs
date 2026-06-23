'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, Package, Plus, MessageSquare } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, listings: 0 })

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/users').then(r => r.json()),
      fetch('/api/admin/listings').then(r => r.json()),
    ]).then(([users, listings]) => {
      setStats({ users: Array.isArray(users) ? users.length : 0, listings: Array.isArray(listings) ? listings.length : 0 })
    })
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              <p className="text-xs text-gray-500">Korisnika</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Package size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.listings}</p>
              <p className="text-xs text-gray-500">Oglasa</p>
            </div>
          </div>
        </Card>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Brze akcije</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/korisnici/novi" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><Plus size={20} className="text-primary-600" /></div>
          <div><p className="font-semibold text-gray-900 text-sm">Novi korisnik</p><p className="text-xs text-gray-500">Dodaj korisnika ručno</p></div>
        </Link>
        <Link href="/admin/oglasi/novi" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><Plus size={20} className="text-amber-600" /></div>
          <div><p className="font-semibold text-gray-900 text-sm">Novi oglas</p><p className="text-xs text-gray-500">Postavi oglas za firmu</p></div>
        </Link>
        <Link href="/admin/poruka-svima" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MessageSquare size={20} className="text-blue-600" /></div>
          <div><p className="font-semibold text-gray-900 text-sm">Poruka svima</p><p className="text-xs text-gray-500">Pošalji obaveštenje</p></div>
        </Link>
      </div>
    </div>
  )
}
