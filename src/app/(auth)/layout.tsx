import Link from 'next/link'
import { Recycle } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="py-6 text-center">
        <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl">
          <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
            <Recycle size={20} className="text-white" />
          </div>
          <span className="text-primary-700">Reciklaža</span>
          <span className="text-gray-400 font-normal text-sm">.rs</span>
        </Link>
      </div>
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </div>
  )
}
