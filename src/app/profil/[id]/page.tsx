'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { MapPin, Calendar, ShieldCheck, Package, Factory, Truck, MessageSquare, Settings, Plus, Edit } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ListingCard from '@/components/listings/ListingCard'
import Spinner from '@/components/ui/Spinner'
import { formatDate } from '@/lib/utils/format'

export default function ProfilePage() {
  const { id } = useParams()
  const { data: session } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingMsg, setSendingMsg] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch(`/api/profile/${id}`).then(r => r.json()),
      fetch(`/api/listings?userId=${id}`).then(r => r.json()),
    ]).then(([profileData, listingsData]) => {
      setProfile(profileData)
      setListings(listingsData.listings || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <><Navbar /><main className="flex-1 flex justify-center items-center py-20"><Spinner size={32} /></main><Footer /></>
  )

  if (!profile || profile.error) return (
    <><Navbar /><main className="flex-1 text-center py-20"><p className="text-gray-500">Korisnik nije pronađen.</p></main><Footer /></>
  )

  const isOwnProfile = session?.user?.id === id
  const Icon = profile.userType === 'GENERATOR' ? Factory : Truck

  const handleSendMessage = async () => {
    setSendingMsg(true)
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otherUserId: profile.id }),
      })
      const data = await res.json()
      if (data.id) router.push(`/poruke/${data.id}`)
    } catch {
      setSendingMsg(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-5">
              <Avatar name={profile.companyName} size="lg" className="ring-4 ring-white/20" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{profile.companyName}</h1>
                  {profile.verified && <ShieldCheck size={20} className="text-primary-300" />}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-primary-200 text-sm">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {profile.city}</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Član od {formatDate(profile.createdAt)}</span>
                </div>
                <Badge variant={profile.userType === 'GENERATOR' ? 'warning' : 'success'} className="mt-2">
                  <Icon size={12} className="mr-1" />
                  {profile.userType === 'GENERATOR' ? 'Generator otpada' : 'Sakupljač otpada'}
                </Badge>
              </div>
              {isOwnProfile && (
                <div className="ml-auto">
                  <Link href="/podesavanja" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/25 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/25 transition-colors">
                    <Settings size={16} /> Izmeni profil
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div>
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">O firmi</h3>
                {profile.bio && <p className="text-sm text-gray-600 mb-4">{profile.bio}</p>}
                <dl className="space-y-3 text-sm">
                  <div><dt className="text-gray-400">PIB</dt><dd className="font-medium text-gray-900">{profile.pib}</dd></div>
                  <div><dt className="text-gray-400">Adresa</dt><dd className="font-medium text-gray-900">{profile.address}, {profile.city}</dd></div>
                  <div><dt className="text-gray-400">Kontakt osoba</dt><dd className="font-medium text-gray-900">{profile.contactPerson}</dd></div>
                </dl>

                {!isOwnProfile && (
                  <Button className="w-full mt-5" size="lg" onClick={handleSendMessage} loading={sendingMsg}>
                    <MessageSquare size={18} />
                    Pošalji poruku
                  </Button>
                )}
              </Card>
            </div>

            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {isOwnProfile ? 'Moji oglasi' : 'Oglasi'} ({listings.length})
                </h2>
                {isOwnProfile && profile.userType === 'GENERATOR' && (
                  <Link href="/oglasi/novi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700">
                    <Plus size={16} /> Novi oglas
                  </Link>
                )}
              </div>
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {listings.map((listing: any) => (
                    <div key={listing.id} className="relative">
                      <ListingCard listing={listing} />
                      {isOwnProfile && (
                        <Link
                          href={`/oglasi/${listing.id}/izmeni`}
                          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-xl shadow-md border border-gray-200 text-gray-600 hover:text-primary-600 hover:border-primary-300 transition-colors"
                        >
                          <Edit size={16} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl">
                  <Package size={40} className="text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {isOwnProfile ? 'Nemate aktivnih oglasa' : 'Nema aktivnih oglasa'}
                  </p>
                  {isOwnProfile && profile.userType === 'GENERATOR' && (
                    <Link href="/oglasi/novi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 mt-3">
                      <Plus size={16} /> Postavite prvi oglas
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
