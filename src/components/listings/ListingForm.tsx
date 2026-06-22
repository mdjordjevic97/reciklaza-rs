'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianCities } from '@/lib/constants/serbian-cities'
import { units } from '@/lib/constants/units'

type ListingFormProps = {
  initialData?: {
    id: string
    title: string
    description: string
    wasteIndexNumber: string
    wasteCategory: string
    quantity: number
    unit: string
    pricePerUnit: number | null
    city: string
    address: string | null
    images?: { id: string; imageUrl: string }[]
  }
}

export default function ListingForm({ initialData }: ListingFormProps) {
  const router = useRouter()
  const isEdit = !!initialData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [createdId, setCreatedId] = useState(initialData?.id || '')
  const [showUploader, setShowUploader] = useState(isEdit)

  const [form, setForm] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    wasteIndexNumber: initialData?.wasteIndexNumber || '',
    wasteCategory: initialData?.wasteCategory || '',
    quantity: initialData?.quantity?.toString() || '',
    unit: initialData?.unit || 'kg',
    pricePerUnit: initialData?.pricePerUnit?.toString() || '',
    negotiable: initialData?.pricePerUnit === null,
    city: initialData?.city || '',
    address: initialData?.address || '',
  })

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      title: form.title,
      description: form.description,
      wasteIndexNumber: form.wasteIndexNumber,
      wasteCategory: form.wasteCategory,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      pricePerUnit: form.negotiable ? null : parseFloat(form.pricePerUnit) || null,
      city: form.city,
      address: form.address || undefined,
    }

    try {
      const url = isEdit ? `/api/listings/${initialData!.id}` : '/api/listings'
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Greška pri čuvanju.')
        setLoading(false)
        return
      }

      if (!isEdit) {
        setCreatedId(data.id)
        setShowUploader(true)
        setLoading(false)
        return
      }

      router.push(`/oglasi/${data.id}`)
      router.refresh()
    } catch {
      setError('Došlo je do greške.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input id="title" label="Naslov oglasa *" placeholder="npr. Plastična ambalaža — PET flaše" value={form.title} onChange={e => update('title', e.target.value)} />

        <Textarea id="description" label="Opis *" placeholder="Opišite detaljno vrstu otpada, stanje, količinu..." rows={5} value={form.description} onChange={e => update('description', e.target.value)} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="wasteIndexNumber" label="Indeksni broj otpada *" placeholder="npr. 15 01 02" value={form.wasteIndexNumber} onChange={e => update('wasteIndexNumber', e.target.value)} />
          <Select
            id="wasteCategory"
            label="Kategorija otpada *"
            placeholder="Izaberite kategoriju"
            options={wasteCategories.map(c => ({ value: c.code, label: `${c.code} — ${c.name}` }))}
            value={form.wasteCategory}
            onChange={e => update('wasteCategory', e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input id="quantity" label="Količina *" type="number" step="0.01" min="0" placeholder="100" value={form.quantity} onChange={e => update('quantity', e.target.value)} />
          <Select id="unit" label="Jedinica mere" options={units} value={form.unit} onChange={e => update('unit', e.target.value)} />
          <div>
            <Input
              id="pricePerUnit"
              label="Cena po jedinici (RSD)"
              type="number"
              step="0.01"
              min="0"
              placeholder="50"
              value={form.pricePerUnit}
              onChange={e => update('pricePerUnit', e.target.value)}
              disabled={form.negotiable}
            />
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.negotiable} onChange={e => update('negotiable', e.target.checked)} className="w-4 h-4 text-primary-600 rounded border-gray-300" />
              <span className="text-sm text-gray-600">Po dogovoru</span>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="city"
            label="Grad *"
            placeholder="Izaberite grad"
            options={serbianCities.map(c => ({ value: c, label: c }))}
            value={form.city}
            onChange={e => update('city', e.target.value)}
          />
          <Input id="address" label="Adresa (opciono)" placeholder="Ulica i broj" value={form.address} onChange={e => update('address', e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 border border-red-200 p-3 rounded-xl">{error}</p>}

        {!showUploader && (
          <Button type="submit" loading={loading} size="lg">
            <Save size={18} />
            {isEdit ? 'Sačuvaj izmene' : 'Kreiraj oglas'}
          </Button>
        )}
      </form>

      {showUploader && createdId && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Dodajte slike</h3>
          <ImageUploader
            listingId={createdId}
            existingImages={initialData?.images}
          />
          <div className="mt-6">
            <Button onClick={() => { router.push(`/oglasi/${createdId}`); router.refresh() }} size="lg">
              {isEdit ? 'Nazad na oglas' : 'Završi i objavi oglas'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
