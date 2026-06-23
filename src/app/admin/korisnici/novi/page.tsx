'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, AlertCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { serbianCities } from '@/lib/constants/serbian-cities'

export default function AdminNewUserPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    email: '', password: '', companyName: '', pib: '', address: '', city: '', contactPerson: '', phone: '',
    userType: 'GENERATOR', verified: false,
  })

  const update = (field: string, value: string | boolean) => { setForm(prev => ({ ...prev, [field]: value })); setError('') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }
    router.push('/admin/korisnici')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Novi korisnik</h1>
      <Card className="max-w-2xl">
        {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="email" type="email" label="Email *" value={form.email} onChange={e => update('email', e.target.value)} required />
            <Input id="password" type="password" label="Lozinka *" value={form.password} onChange={e => update('password', e.target.value)} required />
          </div>
          <Input id="companyName" label="Naziv firme *" value={form.companyName} onChange={e => update('companyName', e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="pib" label="PIB *" maxLength={9} value={form.pib} onChange={e => update('pib', e.target.value)} required />
            <Select id="userType" label="Tip korisnika *" options={[{ value: 'GENERATOR', label: 'Generator otpada' }, { value: 'COLLECTOR', label: 'Sakupljač otpada' }]} value={form.userType} onChange={e => update('userType', e.target.value)} />
          </div>
          <Input id="address" label="Adresa *" value={form.address} onChange={e => update('address', e.target.value)} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="city" label="Grad *" placeholder="Izaberite grad" options={serbianCities.map(c => ({ value: c, label: c }))} value={form.city} onChange={e => update('city', e.target.value)} />
            <Input id="contactPerson" label="Kontakt osoba *" value={form.contactPerson} onChange={e => update('contactPerson', e.target.value)} required />
          </div>
          <Input id="phone" label="Telefon" value={form.phone} onChange={e => update('phone', e.target.value)} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.verified} onChange={e => update('verified', e.target.checked)} className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-gray-700">Verifikovan korisnik</span>
          </label>
          <Button type="submit" loading={loading} size="lg"><Save size={18} /> Kreiraj korisnika</Button>
        </form>
      </Card>
    </div>
  )
}
