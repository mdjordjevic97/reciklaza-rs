'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { wasteCategories } from '@/lib/constants/waste-categories'
import { serbianCities } from '@/lib/constants/serbian-cities'
import { units } from '@/lib/constants/units'

export default function AdminNewListingPage() {
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    userId: '', title: '', description: '', wasteIndexNumber: '', wasteCategory: '',
    quantity: '', unit: 'kg', pricePerUnit: '', negotiable: false, city: '', address: '',
  })

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(data => { if (Array.isArray(data)) setUsers(data) })
  }, [])

  const update = (field: string, value: string | boolean) => { setForm(prev => ({ ...prev, [field]: value })); setError('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')

    const res = await fetch('/api/admin/listings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        quantity: parseFloat(form.quantity),
        pricePerUnit: form.negotiable ? null : parseFloat(form.pricePerUnit) || null,
      }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push('/admin/oglasi')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novi oglas (admin)</h1>
      <Card className="max-w-2xl">
        {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select id="userId" label="Firma (vlasnik oglasa) *" placeholder="Izaberite firmu"
            options={users.map(u => ({ value: u.id, label: `${u.companyName} (${u.city})` }))}
            value={form.userId} onChange={e => update('userId', e.target.value)} />
          <Input id="title" label="Naslov *" value={form.title} onChange={e => update('title', e.target.value)} required />
          <Textarea id="description" label="Opis *" rows={4} value={form.description} onChange={e => update('description', e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="wasteIndexNumber" label="Indeksni broj *" placeholder="npr. 15 01 02" value={form.wasteIndexNumber} onChange={e => update('wasteIndexNumber', e.target.value)} required />
            <Select id="wasteCategory" label="Kategorija *" placeholder="Izaberite"
              options={wasteCategories.map(c => ({ value: c.value, label: c.label }))}
              value={form.wasteCategory} onChange={e => update('wasteCategory', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input id="quantity" label="Količina *" type="number" step="0.01" value={form.quantity} onChange={e => update('quantity', e.target.value)} required />
            <Select id="unit" label="Jedinica" options={units} value={form.unit} onChange={e => update('unit', e.target.value)} />
            <div>
              <Input id="pricePerUnit" label="Cena (RSD)" type="number" value={form.pricePerUnit} onChange={e => update('pricePerUnit', e.target.value)} disabled={form.negotiable} />
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={form.negotiable} onChange={e => update('negotiable', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
                <span className="text-sm text-gray-600">Po dogovoru</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="city" label="Grad *" placeholder="Izaberite" options={serbianCities.map(c => ({ value: c, label: c }))} value={form.city} onChange={e => update('city', e.target.value)} />
            <Input id="address" label="Adresa" value={form.address} onChange={e => update('address', e.target.value)} />
          </div>
          <Button type="submit" loading={loading} size="lg"><Save size={18} /> Kreiraj oglas</Button>
        </form>
      </Card>
    </div>
  )
}
