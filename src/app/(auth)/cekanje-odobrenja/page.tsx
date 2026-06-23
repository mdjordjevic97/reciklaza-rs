import Link from 'next/link'
import { Clock, ShieldCheck } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function WaitingApprovalPage() {
  return (
    <Card>
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Čekanje odobrenja</h1>
        <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
          Vaš email je verifikovan. Naš administrator pregleda vaše dozvole i podatke firme.
          Bićete obavešteni putem email-a kada vaš nalog bude odobren.
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 max-w-sm mx-auto">
          <div className="flex items-center gap-3 text-left">
            <ShieldCheck size={20} className="text-primary-600 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">Šta administrator proverava?</p>
              <ul className="text-xs text-gray-500 mt-1 space-y-0.5">
                <li>• Validnost dozvola za upravljanje otpadom</li>
                <li>• Tačnost podataka firme i PIB-a</li>
                <li>• Usklađenost sa zakonskim propisima</li>
              </ul>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mb-4">Proces obično traje do 24 sata u radnim danima.</p>

        <Link href="/prijava" className="text-sm text-primary-600 font-semibold hover:text-primary-700">
          Nazad na prijavu
        </Link>
      </div>
    </Card>
  )
}
