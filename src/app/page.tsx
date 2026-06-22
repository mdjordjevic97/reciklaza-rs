import Link from 'next/link'
import { ArrowRight, Recycle, Search, MessageSquare, Factory, Truck, BarChart3 } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const steps = [
  { icon: Factory, title: 'Registrujte se', desc: 'Kreirajte nalog kao generator ili sakupljač otpada i dodajte vaše dozvole.' },
  { icon: Search, title: 'Pregledajte ili postavite oglas', desc: 'Pretražite oglase po vrsti otpada, lokaciji i ceni, ili postavite svoj oglas.' },
  { icon: MessageSquare, title: 'Dogovorite se', desc: 'Kontaktirajte drugu stranu direktno kroz platformu i dogovorite detalje.' },
]


export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 py-24 sm:py-32 lg:py-40">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8">
              <Recycle size={16} className="text-primary-300" />
              <span className="text-primary-200 text-sm font-medium">Platforma za trgovinu otpadom u Srbiji</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-4xl mx-auto tracking-tight">
              Kupujte i prodajte otpad <span className="text-primary-300">brzo i bezbedno</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-primary-100/90 max-w-2xl mx-auto leading-relaxed">
              Povežite se sa generatorima i sakupljačima otpada. Pronađite materijale za reciklažu ili prodajte otpad po najboljoj ceni.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/registracija" className="inline-flex items-center gap-2 bg-white text-primary-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5">
                Započnite besplatno <ArrowRight size={18} />
              </Link>
              <Link href="/prijava" className="inline-flex items-center gap-2 text-white/90 border border-white/25 px-7 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-all">
                Već imate nalog? Prijavite se
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-primary-600 font-semibold text-sm tracking-wide uppercase mb-3">Kako funkcioniše</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Tri jednostavna koraka</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map(({ icon: Icon, title, desc }, i) => (
                <div key={title} className="text-center group">
                  <div className="relative mx-auto mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-primary-600 transition-all duration-300">
                      <Icon size={28} className="text-primary-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block text-primary-600 font-semibold text-sm tracking-wide uppercase mb-3">Za koga je platforma</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Dva tipa korisnika</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-5">
                  <Factory size={28} className="text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Generatori otpada</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Firme koje proizvode otpad i žele da ga prodaju ili predaju na reciklažu.</p>
                <ul className="space-y-2">
                  {['Postavite oglas za otpad', 'Dobijte ponude od sakupljača', 'Komunicirajte direktno na platformi'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart3 size={14} className="text-primary-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
                  <Truck size={28} className="text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Sakupljači otpada</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">Firme koje sakupljaju, skladište ili prerađuju otpad.</p>
                <ul className="space-y-2">
                  {['Pretražite dostupan otpad', 'Filtrirajte po vrsti i lokaciji', 'Kontaktirajte generatore direktno'].map(item => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart3 size={14} className="text-primary-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
              <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-500/30 rounded-full blur-3xl" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">Spremni da počnete?</h2>
                <p className="text-primary-200 max-w-xl mx-auto mb-8 text-base sm:text-lg">Registrujte se besplatno i počnite da trgujete otpadom na najbezbednijoj platformi u Srbiji.</p>
                <Link href="/registracija" className="inline-flex items-center gap-2 bg-white text-primary-700 px-7 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-all shadow-lg hover:-translate-y-0.5">
                  Registrujte se besplatno <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
