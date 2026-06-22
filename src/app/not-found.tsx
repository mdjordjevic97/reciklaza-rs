import Link from 'next/link'
import { Home } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center">
          <p className="text-7xl font-bold text-primary-600 mb-4">404</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Stranica nije pronađena</h1>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Stranica koju tražite ne postoji ili je premeštena.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <Home size={18} />
            Početna strana
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
