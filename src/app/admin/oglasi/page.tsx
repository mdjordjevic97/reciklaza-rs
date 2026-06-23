'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Edit, Trash2, Package } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils/format'

export default function AdminListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchListings = (q = '') => {
    setLoading(true)
    fetch(`/api/admin/listings${q ? `?search=${q}` : ''}`)
      .then(r => r.json())
      .then(data => { setListings(Array.isArray(data) ? data : []); setLoading(false) })
  }

  useEffect(() => { fetchListings() }, [])

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchListings(search) }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Obrisati oglas "${title}"?`)) return
    await fetch(`/api/admin/listings/${id}`, { method: 'DELETE' })
    setListings(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Oglasi ({listings.length})</h1>
        <Link href="/admin/oglasi/novi"><Button size="sm"><Plus size={16} /> Novi oglas</Button></Link>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Pretraži po naslovu, broju, gradu..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
        </div>
      </form>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Oglas</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Firma</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Indeks</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell">Grad</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Cena</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">Akcije</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {listings.map(listing => (
              <tr key={listing.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {listing.images?.[0] ? (
                      <img src={listing.images[0].imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Package size={16} className="text-gray-300" /></div>
                    )}
                    <span className="font-medium text-gray-900 truncate max-w-[200px]">{listing.title}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{listing.user?.companyName}</td>
                <td className="px-4 py-3 font-mono text-gray-500 hidden lg:table-cell">{listing.wasteIndexNumber}</td>
                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{listing.city}</td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatPrice(listing.pricePerUnit)}</td>
                <td className="px-4 py-3">
                  <Badge variant={listing.status === 'ACTIVE' ? 'success' : 'secondary'}>{listing.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/oglasi/${listing.id}`} className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100"><Edit size={16} /></Link>
                    <button onClick={() => handleDelete(listing.id, listing.title)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={16} /></button>
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
