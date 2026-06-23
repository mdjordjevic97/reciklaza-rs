'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, AlertCircle, Clock, Mail } from 'lucide-react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/oglasi'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorType, setErrorType] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setErrorType('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      if (result.error.includes('EMAIL_NOT_VERIFIED')) {
        setErrorType('email')
        setError('Email adresa nije verifikovana.')
      } else if (result.error.includes('NOT_APPROVED')) {
        setErrorType('approval')
        setError('Vaš nalog čeka odobrenje administratora.')
      } else {
        setError('Pogrešan email ili lozinka.')
      }
      setLoading(false)
      return
    }

    router.push(callbackUrl)
    router.refresh()
  }

  return (
    <Card>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Prijavite se</h1>
        <p className="text-gray-500 mt-2">Unesite vaše podatke za pristup platformi</p>
      </div>

      {error && (
        <div className={`flex items-start gap-2.5 p-3 mb-6 border rounded-xl text-sm ${
          errorType === 'approval' ? 'bg-amber-50 border-amber-200 text-amber-700' :
          errorType === 'email' ? 'bg-blue-50 border-blue-200 text-blue-700' :
          'bg-red-50 border-red-200 text-red-600'
        }`}>
          {errorType === 'approval' ? <Clock size={16} className="mt-0.5 shrink-0" /> :
           errorType === 'email' ? <Mail size={16} className="mt-0.5 shrink-0" /> :
           <AlertCircle size={16} className="mt-0.5 shrink-0" />}
          <div>
            <p>{error}</p>
            {errorType === 'email' && (
              <Link href={`/verifikacija-emaila?email=${encodeURIComponent(email)}`} className="font-semibold underline mt-1 block">
                Verifikujte email →
              </Link>
            )}
            {errorType === 'approval' && (
              <Link href="/cekanje-odobrenja" className="font-semibold underline mt-1 block">
                Saznajte više →
              </Link>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input id="email" type="email" label="Email adresa" placeholder="vas@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input id="password" type="password" label="Lozinka" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          <LogIn size={18} />
          Prijavite se
        </Button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <Link href="/zaboravljena-lozinka" className="block text-sm text-gray-500 hover:text-primary-600">
          Zaboravili ste lozinku?
        </Link>
        <p className="text-sm text-gray-500">
          Nemate nalog?{' '}
          <Link href="/registracija" className="text-primary-600 font-semibold hover:text-primary-700">
            Registrujte se
          </Link>
        </p>
      </div>
    </Card>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
