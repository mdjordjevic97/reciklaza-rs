'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function VerifyForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code || code.length !== 6) { setError('Unesite 6-cifreni kod.'); return }
    setLoading(true); setError('')

    const res = await fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    })
    const data = await res.json()

    if (!res.ok) { setError(data.error); setLoading(false); return }
    setSuccess(true)
    setTimeout(() => router.push('/cekanje-odobrenja'), 2000)
  }

  const handleResend = async () => {
    setResending(true); setError('')
    await fetch('/api/verify-email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setResending(false)
  }

  if (success) {
    return (
      <Card>
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-primary-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Email je verifikovan!</h2>
          <p className="text-gray-500 text-sm">Vaš nalog čeka odobrenje administratora. Bićete obavešteni putem email-a.</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail size={28} className="text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Verifikujte email</h1>
        <p className="text-gray-500 mt-2 text-sm">Poslali smo 6-cifreni kod na <strong>{email}</strong></p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-5">
        <Input
          id="code"
          label="Verifikacioni kod"
          placeholder="000000"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
          className="text-center text-2xl tracking-[0.5em] font-bold"
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Potvrdi kod
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">Niste dobili kod?</p>
        <button onClick={handleResend} disabled={resending} className="text-sm text-primary-600 font-semibold hover:text-primary-700 mt-1 flex items-center gap-1 mx-auto">
          <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
          {resending ? 'Šaljem...' : 'Pošalji ponovo'}
        </button>
      </div>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyForm /></Suspense>
}
