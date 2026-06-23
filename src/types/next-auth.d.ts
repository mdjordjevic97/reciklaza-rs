import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string | null
      userType: string
      companyName: string
      verified: boolean
      isAdmin: boolean
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType: string
    companyName: string
    verified: boolean
    isAdmin: boolean
  }
}
