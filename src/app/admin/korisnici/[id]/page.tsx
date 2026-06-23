'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { serbianCities } from '@/lib/constants/serbian-cities'

export default function AdminEditUserPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    fetch(`/api/admin/users/${id}`).then(r => r.json()).then(data => { setForm(data); setLoading(false) })
  }, [id])

  const update = (field: string, value: string | boolean) => { setForm((prev: any) => ({ ...prev, [field]: value })); setError(''); setSuccess('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')

    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) { setSuccess('Korisnik je ažuriran.') } else { const d = await res.json(); setError(d.error) }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Izmena korisnika: {form.companyName}</h1>
      <Card className="max-w-2xl">
        {success && <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {success}</div>}
        {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500 mb-2">
            <span className="font-medium">Email:</span> {form.email} &nbsp;|&nbsp; <span className="font-medium">PIB:</span> {form.pib}
          </div>
          <Input id="companyName" label="Naziv firme" value={form.companyName || ''} onChange={e => update('companyName', e.target.value)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="userType" label="Tip korisnika" options={[{ value: 'GENERATOR', label: 'Generator otpada' }, { value: 'COLLECTOR', label: 'Sakupljač otpada' }]} value={form.userType || ''} onChange={e => update('userType', e.target.value)} />
            <Select id="city" label="Grad" placeholder="Izaberite grad" options={serbianCities.map(c => ({ value: c, label: c }))} value={form.city || ''} onChange={e => update('city', e.target.value)} />
          </div>
          <Input id="address" label="Adresa" value={form.address || ''} onChange={e => update('address', e.target.value)} />
          <Input id="contactPerson" label="Kontakt osoba" value={form.contactPerson || ''} onChange={e => update('contactPerson', e.target.value)} />
          <Input id="phone" label="Telefon" value={form.phone || ''} onChange={e => update('phone', e.target.value)} />
          <Textarea id="bio" label="O firmi" rows={3} value={form.bio || ''} onChange={e => update('bio', e.target.value)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.verified || false} onChange={e => update('verified', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700">Verifikovan korisnik</span>
          </label>
          <Button type="submit" loading={saving} size="lg"><Save size={18} /> Sačuvaj izmene</Button>
        </form>
      </Card>
    </div>
  )
}
