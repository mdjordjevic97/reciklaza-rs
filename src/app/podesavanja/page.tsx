'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Save, AlertCircle, CheckCircle, Lock, FileText, Upload, Trash2, ExternalLink } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'
import { wasteCategories } from '@/lib/constants/waste-categories'

export default function SettingsPage() {
  const { data: session } = useSession()

  // Podaci firme
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ companyName: '', address: '', city: '', contactPerson: '', phone: '', bio: '' })
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Lozinka
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMessage, setPwMessage] = useState('')
  const [pwError, setPwError] = useState('')
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  // Dozvole
  const [permits, setPermits] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [permitMsg, setPermitMsg] = useState('')

  useEffect(() => {
    if (!session?.user?.id) return
    fetch(`/api/profile/${session.user.id}`)
      .then(r => r.json())
      .then(data => {
        setForm({ companyName: data.companyName || '', address: data.address || '', city: data.city || '', contactPerson: data.contactPerson || '', phone: data.phone || '', bio: data.bio || '' })
        try { setSelectedCategories(JSON.parse(data.wasteCategories || '[]')) } catch { setSelectedCategories([]) }
      })
    fetch('/api/permits').then(r => r.json()).then(setPermits)
  }, [session])

  const toggleCategory = (val: string) =>
    setSelectedCategories(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setMessage('')
    const res = await fetch(`/api/profile/${session?.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, wasteCategories: selectedCategories }),
    })
    if (res.ok) setMessage('Podešavanja su sačuvana.')
    else { const d = await res.json(); setError(d.error || 'Greška.') }
    setLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError(''); setPwMessage('')
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwError('Lozinke se ne poklapaju.'); return }
    if (pwForm.newPassword.length < 8) { setPwError('Nova lozinka mora imati najmanje 8 karaktera.'); return }
    setPwLoading(true)
    const res = await fetch(`/api/profile/${session?.user?.id}/password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
    })
    if (res.ok) { setPwMessage('Lozinka je uspešno promenjena.'); setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' }) }
    else { const d = await res.json(); setPwError(d.error || 'Greška.') }
    setPwLoading(false)
  }

  const handlePermitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    setUploading(true); setPermitMsg('')
    const body = new FormData()
    Array.from(files).forEach(f => body.append('permits', f))
    const res = await fetch('/api/permits', { method: 'POST', body })
    if (res.ok) {
      const newPermits = await res.json()
      setPermits(prev => [...newPermits, ...prev])
      setPermitMsg('Dozvola je uspešno dodata.')
    } else { setPermitMsg('Greška pri uploadu.') }
    setUploading(false)
    e.target.value = ''
  }

  const handleDeletePermit = async (id: string) => {
    if (!confirm('Obrisati ovu dozvolu?')) return
    const res = await fetch(`/api/permits/${id}`, { method: 'DELETE' })
    if (res.ok) setPermits(prev => prev.filter(p => p.id !== id))
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-primary-800 to-primary-600 py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Podešavanja</h1>
            <p className="text-primary-100 mt-2">Ažurirajte podatke firme, dozvole i lozinku</p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* Podaci firme */}
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-5">Podaci firme</h2>
            {message && <div className="flex items-center gap-2 p-3 mb-5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {message}</div>}
            {error && <div className="flex items-center gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input id="companyName" label="Naziv firme" value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} />
              <Input id="address" label="Adresa" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
              <Input id="city" label="Grad" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
              <Input id="contactPerson" label="Kontakt osoba" value={form.contactPerson} onChange={e => setForm(f => ({ ...f, contactPerson: e.target.value }))} />
              <Input id="phone" label="Telefon" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              <Textarea id="bio" label="O firmi" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorije otpada kojima se bavite</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {wasteCategories.map(cat => (
                    <label key={cat.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedCategories.includes(cat.value) ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}>
                      <input type="checkbox" checked={selectedCategories.includes(cat.value)} onChange={() => toggleCategory(cat.value)} className="w-4 h-4 text-primary-600 rounded accent-primary-600" />
                      <span className="text-sm font-medium text-gray-700">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" loading={loading} size="lg"><Save size={18} /> Sačuvaj izmene</Button>
            </form>
          </Card>

          {/* Dozvole */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-primary-600" /> Moje dozvole ({permits.length})
              </h2>
              <label className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                <Upload size={15} /> {uploading ? 'Uploadovanje...' : 'Dodaj'}
                <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple disabled={uploading} onChange={handlePermitUpload} />
              </label>
            </div>
            {permitMsg && <p className="text-sm text-primary-600 mb-3">{permitMsg}</p>}
            {permits.length === 0 ? (
              <p className="text-sm text-gray-400">Nema uploadovanih dozvola.</p>
            ) : (
              <div className="space-y-2">
                {permits.map(permit => {
                  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(permit.fileUrl)
                  return (
                    <div key={permit.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                      <FileText size={18} className="text-gray-400 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{permit.fileName}</p>
                        <p className="text-xs text-gray-400">{permit.permitType}</p>
                      </div>
                      <a href={permit.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <ExternalLink size={16} />
                      </a>
                      <button onClick={() => handleDeletePermit(permit.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {/* Promena lozinke */}
          <Card>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center"><Lock size={20} className="text-primary-600" /></div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Promena lozinke</h2>
                <p className="text-sm text-gray-500">Najmanje 8 karaktera</p>
              </div>
            </div>
            {pwMessage && <div className="flex items-center gap-2 p-3 mb-5 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {pwMessage}</div>}
            {pwError && <div className="flex items-center gap-2 p-3 mb-5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {pwError}</div>}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input id="currentPassword" type="password" label="Trenutna lozinka" placeholder="••••••••" value={pwForm.currentPassword} onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))} />
              <Input id="newPassword" type="password" label="Nova lozinka" placeholder="Najmanje 8 karaktera" value={pwForm.newPassword} onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))} />
              <Input id="confirmPassword" type="password" label="Potvrdite novu lozinku" placeholder="Ponovite novu lozinku" value={pwForm.confirmPassword} onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))} />
              <Button type="submit" loading={pwLoading} size="lg"><Lock size={18} /> Promeni lozinku</Button>
            </form>
          </Card>

        </div>
      </main>
      <Footer />
    </>
  )
}
