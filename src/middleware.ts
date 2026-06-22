export { auth as middleware } from '@/lib/auth'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)'],
}
