'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MapPin, Calendar, Eye, Package, User, Edit, Trash2, MessageSquare, ChevronLeft, ChevronRight, ShieldCheck, AlertTriangle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import { formatPrice, formatDate, formatQuantity } from '@/lib/utils/format'
import { getCategoryLabel } from '@/lib/constants/waste-categories'

export default function ListingDetailPage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [imgIndex, setImgIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(data => { setListing(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) return
    setDeleting(true)
    await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    router.push('/oglasi')
    router.refresh()
  }

  const handleStartConversation = async () => {
    const res = await fetch('/api/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId: listing.id, otherUserId: listing.user.id }),
    })
    const data = await res.json()
    if (data.id) router.push(`/poruke/${data.id}`)
  }

  if (loading) return (
    <>
      <Navbar />
      <main className="flex-1 flex justify-center items-center py-20"><Spinner size={32} /></main>
      <Footer />
    </>
  )

  if (!listing || listing.error) return (
    <>
      <Navbar />
      <main className="flex-1 flex flex-col justify-center items-center py-20">
        <Package size={48} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Oglas nije pronađen</h2>
        <Link href="/oglasi" className="text-primary-600 font-medium hover:text-primary-700">Nazad na oglase</Link>
      </main>
      <Footer />
    </>
  )

  const isOwner = session?.user?.id === listing.user.id
  const images = listing.images || []

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/oglasi" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-6">
            <ChevronLeft size={16} /> Nazad na oglase
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Image gallery */}
              {images.length > 0 ? (
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-gray-100">
                  <img src={images[imgIndex]?.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                  {images.length > 1 && (
                    <>
                      <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={() => setImgIndex(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60">
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_: any, i: number) => (
                          <button key={i} onClick={() => setImgIndex(i)} className={`w-2.5 h-2.5 rounded-full transition-colors ${i === imgIndex ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-[16/10] rounded-2xl bg-gray-100 flex items-center justify-center">
                  <Package size={64} className="text-gray-300" />
                </div>
              )}

              {/* Details */}
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{listing.title}</h1>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {listing.municipality}</span>
                      <span className="flex items-center gap-1"><Eye size={14} /> {listing.viewsCount} pregleda</span>
                      <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(listing.createdAt)}</span>
                    </div>
                  </div>
                  {isOwner && (
                    <div className="flex gap-2">
                      <Link href={`/oglasi/${listing.id}/izmeni`}>
                        <Button variant="outline" size="sm"><Edit size={14} /> Izmeni</Button>
                      </Link>
                      <Button variant="danger" size="sm" onClick={handleDelete} loading={deleting}><Trash2 size={14} /></Button>
                    </div>
                  )}
                </div>

                {listing.isHazardous && (
                  <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    <AlertTriangle size={16} /> Opasan otpad — potrebne specijalne dozvole za rukovanje
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-medium">Kategorija</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{getCategoryLabel(listing.wasteSubcategory || listing.wasteCategory)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-medium">Indeksni broj</p>
                    <p className="text-sm font-bold text-gray-900 font-mono mt-0.5">{listing.wasteIndexNumber || '—'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-400 uppercase font-medium">Količina</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{formatQuantity(listing.quantity, listing.unit)}</p>
                  </div>
                  <div className="bg-primary-50 rounded-xl p-3 border border-primary-100">
                    <p className="text-xs text-primary-500 uppercase font-medium">Cena</p>
                    <p className="text-sm font-bold text-primary-700 mt-0.5">{formatPrice(listing.pricePerUnit)}</p>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-gray-900 mb-2">Opis</h2>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{listing.description}</p>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Oglas postavio</h3>
                <Link href={`/profil/${listing.user.id}`} className="flex items-center gap-3 hover:bg-gray-50 -mx-2 px-2 py-2 rounded-xl transition-colors">
                  <Avatar name={listing.user.companyName} size="lg" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-900">{listing.user.companyName}</p>
                      {listing.user.verified && <ShieldCheck size={16} className="text-primary-600" />}
                    </div>
                    <p className="text-sm text-gray-500">{listing.user.city}</p>
                    <Badge variant={listing.user.userType === 'GENERATOR' ? 'warning' : 'success'} className="mt-1">
                      {listing.user.userType === 'GENERATOR' ? 'Generator' : 'Sakupljač'}
                    </Badge>
                  </div>
                </Link>

                {!isOwner && (
                  <Button className="w-full mt-4" size="lg" onClick={handleStartConversation}>
                    <MessageSquare size={18} />
                    Pošalji poruku
                  </Button>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
