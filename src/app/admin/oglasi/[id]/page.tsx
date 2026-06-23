'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianCities } from '@/lib/constants/serbian-cities'
import { units } from '@/lib/constants/units'

export default function AdminEditListingPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    fetch(`/api/listings/${id}`).then(r => r.json()).then(data => {
      setForm({ ...data, quantity: Number(data.quantity), pricePerUnit: data.pricePerUnit ? Number(data.pricePerUnit) : null })
      setLoading(false)
    })
  }, [id])

  const update = (field: string, value: any) => { setForm((prev: any) => ({ ...prev, [field]: value })); setError(''); setSuccess('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')

    const res = await fetch(`/api/admin/listings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        wasteIndexNumber: form.wasteIndexNumber,
        wasteCategory: form.wasteCategory,
        quantity: parseFloat(form.quantity),
        unit: form.unit,
        pricePerUnit: form.pricePerUnit,
        city: form.city,
        address: form.address,
        status: form.status,
      }),
    })

    if (res.ok) { setSuccess('Oglas je ažuriran.') } else { const d = await res.json(); setError(d.error) }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Izmena oglasa</h1>
      <Card className="max-w-2xl">
        {success && <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {success}</div>}
        {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500 mb-2">
            <span className="font-medium">Firma:</span> {form.user?.companyName}
          </div>
          <Input id="title" label="Naslov" value={form.title || ''} onChange={e => update('title', e.target.value)} />
          <Textarea id="description" label="Opis" rows={4} value={form.description || ''} onChange={e => update('description', e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="wasteIndexNumber" label="Indeksni broj" value={form.wasteIndexNumber || ''} onChange={e => update('wasteIndexNumber', e.target.value)} />
            <Select id="wasteCategory" label="Kategorija" placeholder="Izaberite" options={wasteCategories.map(c => ({ value: c.value, label: c.label }))} value={form.wasteCategory || ''} onChange={e => update('wasteCategory', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input id="quantity" label="Količina" type="number" step="0.01" value={form.quantity ?? ''} onChange={e => update('quantity', e.target.value)} />
            <Select id="unit" label="Jedinica" options={units} value={form.unit || 'kg'} onChange={e => update('unit', e.target.value)} />
            <Input id="pricePerUnit" label="Cena (RSD)" type="number" value={form.pricePerUnit ?? ''} onChange={e => update('pricePerUnit', e.target.value ? parseFloat(e.target.value) : null)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="city" label="Grad" placeholder="Izaberite" options={serbianCities.map(c => ({ value: c, label: c }))} value={form.city || ''} onChange={e => update('city', e.target.value)} />
            <Select id="status" label="Status" options={[{ value: 'ACTIVE', label: 'Aktivan' }, { value: 'PAUSED', label: 'Pauziran' }, { value: 'SOLD', label: 'Prodat' }, { value: 'EXPIRED', label: 'Istekao' }]} value={form.status || 'ACTIVE'} onChange={e => update('status', e.target.value)} />
          </div>
          <Input id="address" label="Adresa" value={form.address || ''} onChange={e => update('address', e.target.value)} />
          <Button type="submit" loading={saving} size="lg"><Save size={18} /> Sačuvaj izmene</Button>
        </form>
      </Card>
    </div>
  )
}
