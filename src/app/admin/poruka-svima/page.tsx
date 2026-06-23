'use client'

import { useState } from 'react'
import { Send, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function AdminBroadcastPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!confirm('Da li ste sigurni da želite da pošaljete ovu poruku SVIM korisnicima?')) return

    setLoading(true); setError(''); setSuccess('')

    const res = await fetch('/api/admin/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const data = await res.json()

    if (res.ok) {
      setSuccess(`Poruka uspešno poslata ${data.sent} korisnicima.`)
      setContent('')
    } else {
      setError(data.error)
    }
    setLoading(false)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Poruka svim korisnicima</h1>
      <p className="text-gray-500 text-sm mb-6">Ova poruka će biti poslata kao direktna poruka svakom korisniku na platformi.</p>

      <Card className="max-w-2xl">
        {success && <div className="flex items-center gap-2 p-3 mb-6 bg-green-50 border border-green-200 rounded-xl text-sm text-green-600"><CheckCircle size={16} /> {success}</div>}
        {error && <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600"><AlertCircle size={16} /> {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            id="content"
            label="Sadržaj poruke"
            rows={6}
            placeholder="Napišite poruku koju želite da pošaljete svim korisnicima..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <p className="text-xs text-gray-400">{content.length}/2000 karaktera</p>
          <Button type="submit" loading={loading} size="lg" disabled={!content.trim()}>
            <Send size={18} /> Pošalji svima
          </Button>
        </form>
      </Card>
    </div>
  )
}
