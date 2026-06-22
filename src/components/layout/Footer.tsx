import Link from 'next/link'
import { Recycle, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <Recycle size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl">Reciklaža<span className="text-gray-500 font-normal text-sm">.rs</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platforma za kupovinu i prodaju otpada u Srbiji. Povežite se sa generatorima i sakupljačima otpada.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Platforma</h3>
            <ul className="space-y-2.5">
              <li><Link href="/oglasi" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Pregledaj oglase</Link></li>
              <li><Link href="/oglasi/novi" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Postavi oglas</Link></li>
              <li><Link href="/registracija" className="text-sm text-gray-400 hover:text-primary-400 transition-colors">Registracija</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Informacije</h3>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-gray-400">Uslovi korišćenja</span></li>
              <li><span className="text-sm text-gray-400">Politika privatnosti</span></li>
              <li><span className="text-sm text-gray-400">Česta pitanja</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-primary-400 shrink-0" />
                <span>info@reciklaza.rs</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-primary-400 shrink-0" />
                <span>+381 11 000 0000</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-primary-400 shrink-0" />
                <span>Beograd, Srbija</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Reciklaža.rs. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  )
}
