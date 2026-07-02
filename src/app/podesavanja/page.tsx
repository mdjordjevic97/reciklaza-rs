'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Save, AlertCircle, CheckCircle, Lock } from 'lucide-react'
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
    companyName: '', address: '', city: '', contactPerson: '', phone: '', bio: '',
  })

  const [pwLoading, setPwLoading] = useState(false)
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwForm, setPwForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
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
    setLoading(true); setError(''); setMessage('')

    const res = await fetch(`/api/profile/${session?.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (res.ok) setMessage('Podešavanja su sačuvana.')
    else { const data = await res.json(); setError(data.error || 'Greška pri čuvanju.') }
    setLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(''); setPwMessage('')

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Nova lozinka i potvrda se ne poklapaju.'); return
    }
    if (pwForm.newPassword.length < 8) {
      setPwError('Nova lozinka mora imati najmanje 8 karaktera.'); return
    }

    setPwLoading(true)
    const res = await fetch(`/api/profile/${session?.user?.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      }),
    })

    if (res.ok) {
      setPwMessage('Lozinka je uspešno promenjena.')
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      const data = await res.json()
      setPwError(data.error || 'Greška pri promeni lozinke.')
    }
    setPwLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Podešavanja</h1>
            <p className="text-primary-100 mt-2">Ažurirajte podatke vaše firme i lozinku</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Podaci firme */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-6">Podaci firme</h2>

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

          {/* Promena lozinke */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Lock size={20} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Promena lozinke</h2>
                <p className="text-sm text-gray-500">Preporučujemo jaku lozinku sa najmanje 8 karaktera</p>
              </div>
            </div>

            {pwMessage && (
              <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600">
                <CheckCircle size={16} /> {pwMessage}
              </div>
            )}
            {pwError && (
              <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                <AlertCircle size={16} /> {pwError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                id="currentPassword"
                type="password"
                label="Trenutna lozinka"
                placeholder="Unesite trenutnu lozinku"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
              />
              <Input
                id="newPassword"
                type="password"
                label="Nova lozinka"
                placeholder="Najmanje 8 karaktera"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
              />
              <Input
                id="confirmPassword"
                type="password"
                label="Potvrdite novu lozinku"
                placeholder="Ponovite novu lozinku"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
              />
              <Button type="submit" loading={pwLoading} size="lg">
                <Lock size={18} /> Promeni lozinku
              </Button>
            </form>
          </Card>

        </div>
      </main>
      <Footer />
    </>
  )
}
