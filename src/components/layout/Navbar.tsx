'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Menu, X, Recycle, Plus, MessageSquare, User, LogOut, Settings, ChevronDown, Users } from 'lucide-react'
import Avatar from '../ui/Avatar'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  const isGenerator = session?.user?.userType === 'GENERATOR'

  const navLinks = [
    { href: '/oglasi', label: 'Oglasi' },
    ...(isGenerator ? [{ href: '/oglasi/novi', label: 'Postavi oglas', icon: Plus }] : []),
    { href: '/korisnici', label: 'Korisnici', icon: Users },
    { href: '/poruke', label: 'Poruke', icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Recycle size={20} className="text-white" />
            </div>
            <span className="text-primary-700">Reciklaža</span>
            <span className="text-gray-400 font-normal text-sm">.rs</span>
          </Link>

          {session && (
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(href)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon size={16} />}
                  {label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden lg:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar name={session.user.companyName} size="sm" />
                  <span className="text-sm font-medium text-gray-700 max-w-[140px] truncate">
                    {session.user.companyName}
                  </span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">{session.user.companyName}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                      </div>
                      <Link
                        href={`/profil/${session.user.id}`}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} /> Moj profil
                      </Link>
                      <Link
                        href="/podesavanja"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-600 hover:text-primary-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings size={16} /> Podešavanja
                      </Link>
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} /> Odjavi se
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/prijava"
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-700 transition-colors"
                >
                  Prijava
                </Link>
                <Link
                  href="/registracija"
                  className="px-4 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
                >
                  Registracija
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-gray-50 rounded-xl">
                  <Avatar name={session.user.companyName} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.user.companyName}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                  </div>
                </div>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(href) ? 'text-primary-700 bg-primary-50' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {Icon && <Icon size={16} />}
                    {label}
                  </Link>
                ))}
                <Link href={`/profil/${session.user.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <User size={16} /> Moj profil
                </Link>
                <Link href="/podesavanja" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <Settings size={16} /> Podešavanja
                </Link>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} /> Odjavi se
                </button>
              </>
            ) : (
              <>
                <Link href="/prijava" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Prijava
                </Link>
                <Link href="/registracija" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-primary-600 hover:bg-primary-50">
                  Registracija
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
