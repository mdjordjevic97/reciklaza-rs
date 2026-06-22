'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Package } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ListingCard from '@/components/listings/ListingCard'
import ListingFilters from '@/components/listings/ListingFilters'
import Spinner from '@/components/ui/Spinner'

function ListingsContent() {
  const searchParams = useSearchParams()
  const [listings, setListings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      const res = await fetch(`/api/listings?${searchParams.toString()}`)
      const data = await res.json()
      setListings(data.listings || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
      setLoading(false)
    }
    fetchListings()
  }, [searchParams])

  return (
    <>
      <ListingFilters />

      <p className="text-sm text-gray-500 mt-4">
        {total} {total === 1 ? 'oglas' : total < 5 ? 'oglasa' : 'oglasa'} pronađeno
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Nema oglasa</h3>
          <p className="text-gray-500 text-sm">Nema oglasa koji odgovaraju vašim kriterijumima.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>

          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <a
                  key={p}
                  href={`/oglasi?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), page: p.toString() }).toString()}`}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-primary-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
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

export default function OglasiPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Svi oglasi</h1>
            <p className="text-primary-100 mt-2">Pronađite otpad za reciklažu ili prodajte vaš otpad</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<div className="flex justify-center py-20"><Spinner size={32} /></div>}>
            <ListingsContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
