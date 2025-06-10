import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      orcidId?: string
      accessToken?: string
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    orcidId?: string
    accessToken?: string
  }

  interface Profile {
    orcidId?: string
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    orcidId?: string
    accessToken?: string
  }
}