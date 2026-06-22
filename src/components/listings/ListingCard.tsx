import Link from 'next/link'
import { MapPin, Eye, Calendar, Package } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { formatPrice, formatRelativeTime, formatQuantity } from '@/lib/utils/format'

type ListingCardProps = {
  listing: {
    id: string
    title: string
    wasteIndexNumber: string
    wasteCategory: string
    quantity: number
    unit: string
    pricePerUnit: number | null
    city: string
    viewsCount: number
    createdAt: string
    user: { companyName: string; userType: string; verified: boolean }
    images: { imageUrl: string }[]
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  const image = listing.images[0]?.imageUrl

  return (
    <Link
      href={`/oglasi/${listing.id}`}
      className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      <div className="aspect-[16/10] bg-gray-100 relative overflow-hidden">
        {image ? (
          <img src={image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={40} className="text-gray-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge variant={listing.user.userType === 'GENERATOR' ? 'warning' : 'success'}>
            {listing.user.userType === 'GENERATOR' ? 'Generator' : 'Sakupljač'}
          </Badge>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-primary-700 transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">{listing.wasteIndexNumber}</span>
          <span className="truncate">{listing.wasteCategory}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-primary-700">
            {formatPrice(listing.pricePerUnit)}
          </span>
          <span className="text-sm text-gray-500">
            {formatQuantity(listing.quantity, listing.unit)}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            <span>{listing.city}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye size={12} /> {listing.viewsCount}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {formatRelativeTime(listing.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
