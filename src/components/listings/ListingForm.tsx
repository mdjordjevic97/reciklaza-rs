'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianMunicipalities } from '@/lib/constants/serbian-cities'
import { units } from '@/lib/constants/units'

type ListingFormProps = {
  initialData?: {
    id: string
    title: string
    description: string
    wasteIndexNumber: string
    wasteCategory: string
    wasteSubcategory: string | null
    isHazardous: boolean
    quantity: number
    unit: string
    pricePerUnit: number | null
    municipality: string
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
    wasteSubcategory: initialData?.wasteSubcategory || '',
    isHazardous: initialData?.isHazardous ?? false,
    quantity: initialData?.quantity?.toString() || '',
    unit: initialData?.unit || 'kg',
    pricePerUnit: initialData?.pricePerUnit?.toString() || '',
    negotiable: initialData?.pricePerUnit === null,
    municipality: initialData?.municipality || '',
    address: initialData?.address || '',
  })

  const update = (field: string, value: string | boolean) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'wasteCategory') next.wasteSubcategory = ''
      return next
    })
    setError('')
  }

  const selectedCategory = wasteCategories.find(c => c.value === form.wasteCategory)
  const subcategories = selectedCategory?.subcategories || []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      title: form.title,
      description: form.description,
      wasteIndexNumber: form.wasteIndexNumber,
      wasteCategory: form.wasteCategory,
      wasteSubcategory: form.wasteSubcategory || null,
      isHazardous: form.isHazardous,
      quantity: parseFloat(form.quantity),
      unit: form.unit,
      pricePerUnit: form.negotiable ? null : parseFloat(form.pricePerUnit) || null,
      municipality: form.municipality,
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
          <Select
            id="wasteCategory"
            label="Kategorija otpada *"
            placeholder="Izaberite kategoriju"
            options={wasteCategories.map(c => ({ value: c.value, label: c.label }))}
            value={form.wasteCategory}
            onChange={e => update('wasteCategory', e.target.value)}
          />
          {subcategories.length > 0 && (
            <Select
              id="wasteSubcategory"
              label="Podkategorija"
              placeholder="Izaberite podkategoriju"
              options={subcategories.map(s => ({ value: s.value, label: s.label }))}
              value={form.wasteSubcategory}
              onChange={e => update('wasteSubcategory', e.target.value)}
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input id="wasteIndexNumber" label="Indeksni broj otpada" placeholder="npr. 15 01 02" value={form.wasteIndexNumber} onChange={e => update('wasteIndexNumber', e.target.value)} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Vrsta otpada *</label>
            <div className="flex gap-4 mt-2">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                !form.isHazardous ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="hazardous" checked={!form.isHazardous} onChange={() => update('isHazardous', false)} className="sr-only" />
                <span className="text-sm font-medium">Neopasan</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                form.isHazardous ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}>
                <input type="radio" name="hazardous" checked={form.isHazardous} onChange={() => update('isHazardous', true)} className="sr-only" />
                <span className="text-sm font-medium">Opasan</span>
              </label>
            </div>
          </div>
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
            id="municipality"
            label="Opština *"
            placeholder="Izaberite opštinu"
            options={serbianMunicipalities.map(c => ({ value: c, label: c }))}
            value={form.municipality}
            onChange={e => update('municipality', e.target.value)}
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
          <ImageUploader listingId={createdId} existingImages={initialData?.images} />
          <div className="mt-6">
            <Button onClick={() => { router.push(`/oglasi/${createdId}`); router.refresh() }} size="lg">
              <Save size={18} />
              {isEdit ? 'Sačuvaj promene' : 'Završi i objavi oglas'}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
