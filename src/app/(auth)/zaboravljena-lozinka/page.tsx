'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { KeyRound, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { setError('Unesite email adresu.'); return }
    setLoading(true); setError('')

    const res = await fetch('/api/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) { const d = await res.json(); setError(d.error); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <Card>
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={28} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Kod je poslat</h2>
          <p className="text-gray-500 text-sm mb-6">Ako postoji nalog sa tom email adresom, poslali smo vam kod za resetovanje lozinke.</p>
          <Button onClick={() => router.push(`/resetuj-lozinku?email=${encodeURIComponent(email)}`)} className="w-full" size="lg">
            Unesi kod
          </Button>
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
        <h1 className="text-2xl font-bold text-gray-900">Zaboravljena lozinka</h1>
        <p className="text-gray-500 mt-2 text-sm">Unesite email adresu i poslaćemo vam kod za resetovanje.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label="Email adresa" placeholder="vas@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Pošalji kod
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Setili ste se lozinke? <Link href="/prijava" className="text-primary-600 font-semibold hover:text-primary-700">Prijavite se</Link>
      </p>
    </Card>
  )
}
