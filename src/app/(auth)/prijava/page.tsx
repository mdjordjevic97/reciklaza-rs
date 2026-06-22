'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { LogIn, AlertCircle } from 'lucide-react'
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
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Pogrešan email ili lozinka.')
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
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          id="email"
          type="email"
          label="Email adresa"
          placeholder="vas@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          type="password"
          label="Lozinka"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={loading} className="w-full" size="lg">
          <LogIn size={18} />
          Prijavite se
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Nemate nalog?{' '}
        <Link href="/registracija" className="text-primary-600 font-semibold hover:text-primary-700">
          Registrujte se
        </Link>
      </p>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
