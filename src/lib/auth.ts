import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Lozinka', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.companyName,
          image: user.avatarUrl,
          userType: user.userType,
          companyName: user.companyName,
          verified: user.verified,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/prijava',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = (user as any).userType
        token.companyName = (user as any).companyName
        token.verified = (user as any).verified
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.userType = token.userType as string
        session.user.companyName = token.companyName as string
        session.user.verified = token.verified as boolean
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const publicPaths = ['/', '/prijava', '/registracija']
      const isPublic = publicPaths.includes(nextUrl.pathname)

      if (!isLoggedIn && !isPublic) {
        return Response.redirect(new URL(`/prijava?callbackUrl=${nextUrl.pathname}`, nextUrl.origin))
      }

      if (isLoggedIn && (nextUrl.pathname === '/prijava' || nextUrl.pathname === '/registracija')) {
        return Response.redirect(new URL('/oglasi', nextUrl.origin))
      }

      return true
    },
  },
})
