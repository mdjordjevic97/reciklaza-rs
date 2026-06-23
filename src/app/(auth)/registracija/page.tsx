'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Factory, Truck, Building2, Upload, ArrowRight, ArrowLeft, AlertCircle, Check, X } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { serbianCities } from '@/lib/constants/serbian-cities'

type FormData = {
  userType: 'GENERATOR' | 'COLLECTOR' | ''
  companyName: string
  pib: string
  address: string
  city: string
  contactPerson: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

const STEPS = ['Tip korisnika', 'Podaci firme', 'Dozvole', 'Nalog']

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [permits, setPermits] = useState<File[]>([])
  const [formData, setFormData] = useState<FormData>({
    userType: '',
    companyName: '',
    pib: '',
    address: '',
    city: '',
    contactPerson: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const update = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const handlePermitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const valid = files.filter(f => {
      const ok = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(f.type) && f.size <= 10 * 1024 * 1024
      return ok
    })
    setPermits(prev => [...prev, ...valid])
  }

  const removePermit = (index: number) => {
    setPermits(prev => prev.filter((_, i) => i !== index))
  }

  const validateStep = (): boolean => {
    if (step === 0 && !formData.userType) {
      setError('Izaberite tip korisnika')
      return false
    }
    if (step === 1) {
      if (!formData.companyName || !formData.pib || !formData.address || !formData.city || !formData.contactPerson) {
        setError('Popunite sva obavezna polja')
        return false
      }
      if (!/^\d{9}$/.test(formData.pib)) {
        setError('PIB mora imati tačno 9 cifara')
        return false
      }
    }
    if (step === 2 && permits.length === 0) {
      setError('Morate dodati bar jednu dozvolu')
      return false
    }
    if (step === 3) {
      if (!formData.email || !formData.password) {
        setError('Popunite email i lozinku')
        return false
      }
      if (formData.password.length < 8) {
        setError('Lozinka mora imati najmanje 8 karaktera')
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Lozinke se ne poklapaju')
        return false
      }
    }
    return true
  }

  const nextStep = () => {
    if (validateStep()) setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setLoading(true)
    setError('')

    try {
      const body = new FormData()
      Object.entries(formData).forEach(([k, v]) => {
        if (k !== 'confirmPassword' && v) body.append(k, v)
      })
      permits.forEach(f => body.append('permits', f))

      const res = await fetch('/api/register', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Greška pri registraciji')
        setLoading(false)
        return
      }

      router.push(`/verifikacija-emaila?email=${encodeURIComponent(formData.email)}`)
    } catch {
      setError('Došlo je do greške. Pokušajte ponovo.')
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Registracija</h1>
        <p className="text-gray-500 mt-1">Kreirajte nalog na platformi</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              i < step ? 'bg-primary-600 text-white' :
              i === step ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-600' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={`hidden sm:block text-xs font-medium ${i <= step ? 'text-gray-700' : 'text-gray-400'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Step 0: User Type */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">Koji tip korisnika ste?</p>
          {[
            { value: 'GENERATOR' as const, icon: Factory, title: 'Generator otpada', desc: 'Proizvodi otpad koji želi da proda ili preda na reciklažu' },
            { value: 'COLLECTOR' as const, icon: Truck, title: 'Sakupljač otpada', desc: 'Sakuplja, skladišti ili prerađuje otpad' },
          ].map(({ value, icon: Icon, title, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => { update('userType', value); setStep(1) }}
              className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                formData.userType === value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                formData.userType === value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Step 1: Company Data */}
      {step === 1 && (
        <div className="space-y-4">
          <Input id="companyName" label="Naziv firme *" placeholder="Vaša firma d.o.o." value={formData.companyName} onChange={e => update('companyName', e.target.value)} />
          <Input id="pib" label="PIB *" placeholder="123456789" maxLength={9} value={formData.pib} onChange={e => update('pib', e.target.value)} />
          <Input id="address" label="Adresa *" placeholder="Ulica i broj" value={formData.address} onChange={e => update('address', e.target.value)} />
          <Select
            id="city"
            label="Grad *"
            placeholder="Izaberite grad"
            options={serbianCities.map(c => ({ value: c, label: c }))}
            value={formData.city}
            onChange={e => update('city', e.target.value)}
          />
          <Input id="contactPerson" label="Kontakt osoba *" placeholder="Ime i prezime" value={formData.contactPerson} onChange={e => update('contactPerson', e.target.value)} />
          <Input id="phone" label="Telefon (opciono)" placeholder="+381 ..." value={formData.phone} onChange={e => update('phone', e.target.value)} />
        </div>
      )}

      {/* Step 2: Permits */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Dodajte dozvole za {formData.userType === 'COLLECTOR' ? 'sakupljanje ili skladištenje' : 'upravljanje'} otpadom (PDF ili slika, maks. 10MB).
          </p>

          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-primary-400 hover:bg-primary-50/50 transition-colors">
            <Upload size={28} className="text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">Kliknite za dodavanje dozvole</span>
            <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WebP — maks. 10MB</span>
            <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" multiple onChange={handlePermitUpload} />
          </label>

          {permits.length > 0 && (
            <div className="space-y-2">
              {permits.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <Building2 size={16} className="text-primary-600 shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 shrink-0">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <button type="button" onClick={() => removePermit(i)} className="p-1 text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Account Credentials */}
      {step === 3 && (
        <div className="space-y-4">
          <Input id="email" type="email" label="Email adresa *" placeholder="vas@email.com" value={formData.email} onChange={e => update('email', e.target.value)} />
          <Input id="password" type="password" label="Lozinka *" placeholder="Najmanje 8 karaktera" value={formData.password} onChange={e => update('password', e.target.value)} />
          <Input id="confirmPassword" type="password" label="Potvrdite lozinku *" placeholder="Ponovite lozinku" value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        {step > 0 ? (
          <Button variant="ghost" onClick={() => setStep(s => s - 1)}>
            <ArrowLeft size={16} /> Nazad
          </Button>
        ) : <div />}

        {step < 3 ? (
          step > 0 && (
            <Button onClick={nextStep}>
              Dalje <ArrowRight size={16} />
            </Button>
          )
        ) : (
          <Button onClick={handleSubmit} loading={loading} size="lg">
            Kreiraj nalog
          </Button>
        )}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Već imate nalog?{' '}
        <Link href="/prijava" className="text-primary-600 font-semibold hover:text-primary-700">
          Prijavite se
        </Link>
      </p>
    </Card>
  )
}
