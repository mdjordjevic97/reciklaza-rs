'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianCities } from '@/lib/constants/serbian-cities'

export default function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') || ''
  const city = searchParams.get('city') || ''
  const userType = searchParams.get('userType') || ''

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/oglasi?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearAll = () => {
    setSearch('')
    router.push('/oglasi')
  }

  const hasFilters = category || city || userType || searchParams.get('search')

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pretražite oglase..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          />
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${
            showFilters ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filteri</span>
        </button>
      </form>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija otpada</label>
            <select
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Sve kategorije</option>
              {wasteCategories.map((c) => (
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Grad</label>
            <select
              value={city}
              onChange={(e) => updateFilter('city', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Svi gradovi</option>
              {serbianCities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Tip korisnika</label>
            <select
              value={userType}
              onChange={(e) => updateFilter('userType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Svi</option>
              <option value="GENERATOR">Generatori</option>
              <option value="COLLECTOR">Sakupljači</option>
            </select>
          </div>
        </div>
      )}

      {hasFilters && (
        <button onClick={clearAll} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors">
          <X size={14} /> Ukloni sve filtere
        </button>
      )}
    </div>
  )
}
