'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, SlidersHorizontal, X, Factory, Truck, MapPin, ShieldCheck, Users } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import { serbianCities } from '@/lib/constants/serbian-cities'
import { wasteCategories, getCategoryLabel } from '@/lib/constants/waste-categories'

function UserCard({ user }: { user: any }) {
  const Icon = user.userType === 'GENERATOR' ? Factory : Truck
  let cats: string[] = []
  try { cats = JSON.parse(user.wasteCategories || '[]') } catch {}

  return (
    <Link href={`/profil/${user.id}`} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 p-6 hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <Avatar name={user.companyName} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-900 truncate">{user.companyName}</h3>
            {user.verified && <ShieldCheck size={16} className="text-primary-600 shrink-0" />}
          </div>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <MapPin size={14} className="shrink-0" />
            <span>{user.city}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <Badge variant={user.userType === 'GENERATOR' ? 'warning' : 'success'}>
              <Icon size={12} className="mr-1" />
              {user.userType === 'GENERATOR' ? 'Generator' : 'Sakupljač'}
            </Badge>
            <span className="text-xs text-gray-400">{user._count.listings} oglasa</span>
          </div>
          {cats.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {cats.slice(0, 3).map(c => (
                <span key={c} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-md text-xs font-medium">
                  {getCategoryLabel(c)}
                </span>
              ))}
              {cats.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-xs">+{cats.length - 3}</span>}
            </div>
          )}
          {user.bio && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{user.bio}</p>}
        </div>
      </div>
    </Link>
  )
}

function UsersContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)

  const page = parseInt(searchParams.get('page') || '1')
  const city = searchParams.get('city') || ''
  const userType = searchParams.get('userType') || ''
  const wasteCategory = searchParams.get('wasteCategory') || ''

  useEffect(() => {
    setLoading(true)
    fetch(`/api/users?${searchParams.toString()}`)
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setTotal(data.total || 0); setPages(data.pages || 1); setLoading(false) })
      .catch(() => setLoading(false))
  }, [searchParams])

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value); else params.delete(key)
    params.delete('page')
    router.push(`/korisnici?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); updateFilter('search', search) }
  const clearAll = () => { setSearch(''); router.push('/korisnici') }
  const hasFilters = city || userType || wasteCategory || searchParams.get('search')

  return (
    <>
      <div className="space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Pretražite po nazivu firme, gradu ili PIB-u..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 bg-white" />
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilters ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filteri</span>
          </button>
        </form>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white border border-gray-200 rounded-2xl">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Grad</label>
              <select value={city} onChange={e => updateFilter('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Svi gradovi</option>
                {serbianCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Tip korisnika</label>
              <select value={userType} onChange={e => updateFilter('userType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Svi</option>
                <option value="GENERATOR">Generatori</option>
                <option value="COLLECTOR">Sakupljači</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Kategorija otpada</label>
              <select value={wasteCategory} onChange={e => updateFilter('wasteCategory', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-primary-500">
                <option value="">Sve kategorije</option>
                {wasteCategories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
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

      <p className="text-sm text-gray-500 mt-4">{total} korisnika pronađeno</p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <Users size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nema korisnika</h3>
          <p className="text-gray-500 text-sm">Nema korisnika koji odgovaraju vašim kriterijumima.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {users.map(user => <UserCard key={user.id} user={user} />)}
          </div>
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <a key={p} href={`/korisnici?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: p.toString() }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${p === page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                  {p}
                </a>
              ))}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default function KorisniciPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Korisnici</h1>
            <p className="text-primary-100 mt-2">Pronađite generatore i sakupljače otpada</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="flex justify-center py-20"><Spinner size={32} /></div>}>
            <UsersContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
