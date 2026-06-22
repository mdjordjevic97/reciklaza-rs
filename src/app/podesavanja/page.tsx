'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Save, AlertCircle, CheckCircle } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function SettingsPage() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    address: '',
    city: '',
    contactPerson: '',
    phone: '',
    bio: '',
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/profile/${session.user.id}`)
        .then(r => r.json())
        .then(data => {
          setForm({
            companyName: data.companyName || '',
            address: data.address || '',
            city: data.city || '',
            contactPerson: data.contactPerson || '',
            phone: data.phone || '',
            bio: data.bio || '',
          })
        })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const res = await fetch(`/api/profile/${session?.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      setMessage('Podešavanja su sačuvana.')
    } else {
      const data = await res.json()
      setError(data.error || 'Greška pri čuvanju.')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Podešavanja</h1>
            <p className="text-primary-100 mt-2">Ažurirajte podatke vaše firme</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            {message && (
              <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                <CheckCircle size={16} /> {message}
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input id="companyName" label="Naziv firme" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              <Input id="address" label="Adresa" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <Input id="city" label="Grad" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <Input id="contactPerson" label="Kontakt osoba" value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} />
              <Input id="phone" label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Textarea id="bio" label="O firmi" rows={4} placeholder="Kratko opišite delatnost firme..." value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />

              <Button type="submit" loading={loading} size="lg">
                <Save size={18} /> Sačuvaj izmene
              </Button>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
