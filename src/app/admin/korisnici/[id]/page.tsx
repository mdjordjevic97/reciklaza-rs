'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Save, AlertCircle, CheckCircle, FileText, ExternalLink } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { serbianCities } from '@/lib/constants/serbian-cities'
import { formatDate } from '@/lib/utils/format'

export default function AdminEditUserPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({})
  const [permits, setPermits] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/admin/users/${id}`)
      .then(r => r.json())
      .then(data => { setPermits(data.permits || []); setForm(data); setLoading(false) })
  }, [id])

  const update = (field: string, value: string | boolean) => {
    setForm((prev: any) => ({ ...prev, [field]: value })); setError(''); setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) setSuccess('Korisnik je ažuriran.')
    else { const d = await res.json(); setError(d.error) }
    setSaving(false)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size={32} /></div>

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Izmena korisnika: {form.companyName}</h1>

      {/* Dozvole — samo pregled */}
      <Card>
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={18} className="text-primary-600" />
          Uploadovane dozvole ({permits.length})
        </h2>
        {permits.length === 0 ? (
          <p className="text-sm text-gray-400">Nema uploadovanih dozvola.</p>
        ) : (
          <div className="space-y-2">
            {permits.map(permit => {
              const isImage = /\.(jpg|jpeg|png|webp)$/i.test(permit.fileUrl)
              return (
                <div key={permit.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {isImage && (
                    <img src={permit.fileUrl} alt={permit.fileName} className="w-full max-h-56 object-contain bg-gray-50" />
                  )}
                  <div className="flex items-center gap-3 p-3">
                    <FileText size={16} className="text-gray-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{permit.fileName}</p>
                      <p className="text-xs text-gray-400">{permit.permitType} · {formatDate(permit.uploadedAt)}</p>
                    </div>
                    <a
                      href={permit.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors shrink-0"
                    >
                      <ExternalLink size={12} /> Otvori
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Podaci korisnika */}
      <Card>
        <h2 className="text-base font-bold text-gray-900 mb-4">Podaci korisnika</h2>
        {success && <div className="flex items-center gap-2 p-3 mb-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {success}</div>}
        {error && <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-gray-50 rounded-xl text-sm text-gray-500">
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
            <span className="text-sm text-gray-700 font-medium">Verifikovan korisnik</span>
          </label>
          <Button type="submit" loading={saving} size="lg"><Save size={18} /> Sačuvaj izmene</Button>
        </form>
      </Card>
    </div>
  )
}
