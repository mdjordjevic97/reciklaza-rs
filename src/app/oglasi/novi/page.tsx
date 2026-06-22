'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ShieldAlert } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ListingForm from '@/components/listings/ListingForm'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export default function NoviOglasPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const isGenerator = session?.user?.userType === 'GENERATOR'

  if (session && !isGenerator) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <ShieldAlert size={32} className="text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Nemate pristup</h2>
            <p className="text-gray-500 text-sm mb-6">Samo generatori otpada mogu postavljati oglase. Sakupljači mogu pregledati i kontaktirati generatore.</p>
            <Button onClick={() => router.push('/oglasi')}>Pregledaj oglase</Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Postavi novi oglas</h1>
            <p className="text-primary-100 mt-2">Opišite otpad koji nudite i dodajte slike</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <ListingForm />
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
