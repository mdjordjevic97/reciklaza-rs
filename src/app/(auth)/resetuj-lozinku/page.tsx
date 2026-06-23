'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function ResetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''

  const [email, setEmail] = useState(emailParam)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !code || !newPassword) { setError('Sva polja su obavezna.'); return }
    if (code.length !== 6) { setError('Kod mora imati 6 cifara.'); return }
    if (newPassword.length < 8) { setError('Lozinka mora imati najmanje 8 karaktera.'); return }
    if (newPassword !== confirmPassword) { setError('Lozinke se ne poklapaju.'); return }

    setLoading(true)

    const res = await fetch('/api/forgot-password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code, newPassword }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/prijava'), 3000)
  }

  if (success) {
    return (
      <Card>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Lozinka je promenjena!</h2>
          <p className="text-gray-500 text-sm">Preusmeravamo vas na stranicu za prijavu...</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <KeyRound size={28} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nova lozinka</h1>
        <p className="text-gray-500 mt-2 text-sm">Unesite kod koji ste dobili i novu lozinku.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {!emailParam && (
          <Input id="email" type="email" label="Email adresa" value={email} onChange={e => setEmail(e.target.value)} required />
        )}
        <Input
          id="code"
          label="Kod za resetovanje"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-[0.5em] font-bold"
        />
        <Input id="newPassword" type="password" label="Nova lozinka" placeholder="Najmanje 8 karaktera" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
        <Input id="confirmPassword" type="password" label="Potvrdite lozinku" placeholder="Ponovite lozinku" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Promeni lozinku
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/prijava" className="text-primary-600 font-semibold hover:text-primary-700">Nazad na prijavu</Link>
      </p>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return <Suspense><ResetForm /></Suspense>
}
