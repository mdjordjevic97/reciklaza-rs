'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, ShieldCheck, Factory, Truck, CheckCircle } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils/format'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = (q = '') => {
    setLoading(true)
    fetch(`/api/admin/users${q ? `?search=${q}` : ''}`)
      .then(r => r.json())
      .then(data => { setUsers(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { fetchUsers() }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(search)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Obrisati korisnika "${name}"? Ovo će obrisati i sve njihove oglase i poruke.`)) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}/approve`, { method: 'POST' })
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, verified: true } : u))
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Korisnici ({users.length})</h1>
        <Link href="/admin/korisnici/novi">
          <Button size="sm"><Plus size={16} /> Novi korisnik</Button>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Pretraži po imenu, email-u, PIB-u..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Firma</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Email</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Grad</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Tip</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Oglasi</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{user.companyName}</span>
                    {user.isAdmin && <Badge variant="danger">Admin</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{user.email}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{user.city}</td>
                <td className="px-4 py-3">
                  <Badge variant={user.userType === 'GENERATOR' ? 'warning' : 'success'}>
                    {user.userType === 'GENERATOR' ? 'Generator' : 'Sakupljač'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{user._count.listings}</td>
                <td className="px-4 py-3">
                  {user.verified ? (
                    <span className="flex items-center gap-1 text-primary-600 text-xs font-medium"><ShieldCheck size={14} /> Verifikovan</span>
                  ) : (
                    <button onClick={() => handleApprove(user.id)} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg hover:bg-primary-100 transition-colors">
                      <CheckCircle size={14} /> Odobri
                    </button>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/korisnici/${user.id}`} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100">
                      <Edit size={16} />
                    </Link>
                    {!user.isAdmin && (
                      <button onClick={() => handleDelete(user.id, user.companyName)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
