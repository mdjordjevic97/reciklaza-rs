'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ListingForm from '@/components/listings/ListingForm'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'

export default function EditListingPage() {
  const { id } = useParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then(r => r.json())
      .then(data => { setListing(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Izmeni oglas</h1>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {loading ? (
            <div className="flex justify-center py-20"><Spinner size={32} /></div>
          ) : listing ? (
            <Card>
              <ListingForm initialData={{
                id: listing.id,
                title: listing.title,
                description: listing.description,
                wasteIndexNumber: listing.wasteIndexNumber,
                wasteCategory: listing.wasteCategory,
                quantity: Number(listing.quantity),
                unit: listing.unit,
                pricePerUnit: listing.pricePerUnit ? Number(listing.pricePerUnit) : null,
                city: listing.city,
                address: listing.address,
                images: listing.images,
              }} />
            </Card>
          ) : (
            <p className="text-center text-gray-500 py-20">Oglas nije pronađen.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
