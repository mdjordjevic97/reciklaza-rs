'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useState } from 'react'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianMunicipalities } from '@/lib/constants/serbian-cities'

export default function ListingFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const category = searchParams.get('category') || ''
  const subcategory = searchParams.get('subcategory') || ''
  const municipality = searchParams.get('municipality') || ''
  const hazardous = searchParams.get('hazardous') || ''

  const selectedCat = wasteCategories.find(c => c.value === category)

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    if (key === 'category') params.delete('subcategory')
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

  const hasFilters = category || municipality || hazardous || subcategory || searchParams.get('search')

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija</label>
            <select
              value={category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Sve kategorije</option>
              {wasteCategories.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          {selectedCat && selectedCat.subcategories.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Podkategorija</label>
              <select
                value={subcategory}
                onChange={(e) => updateFilter('subcategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Sve</option>
                {selectedCat.subcategories.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Opština</label>
            <select
              value={municipality}
              onChange={(e) => updateFilter('municipality', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Sve opštine</option>
              {serbianMunicipalities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Vrsta otpada</label>
            <select
              value={hazardous}
              onChange={(e) => updateFilter('hazardous', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Svi</option>
              <option value="false">Neopasan</option>
              <option value="true">Opasan</option>
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
