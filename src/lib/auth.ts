import type { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    {
      id: 'orcid',
      name: 'ORCID',
      type: 'oauth',
      authorization: {
        url: 'https://orcid.org/oauth/authorize',
        params: {
          scope: '/authenticate /read-limited',
          response_type: 'code',
        },
      },
      token: 'https://orcid.org/oauth/token',
      userinfo: 'https://pub.orcid.org/v3.0',
      clientId: process.env.ORCID_CLIENT_ID,
      clientSecret: process.env.ORCID_CLIENT_SECRET,
      profile(profile: any) {
        return {
          id: profile.sub || profile.orcid,
          name: profile.name || `${profile.given_name || ''} ${profile.family_name || ''}`.trim(),
          email: profile.email,
          orcidId: profile.orcid || profile.sub,
        }
      },
    } as any,
  ],
  pages: {
    signIn: '/auth/signin',
    newUser: '/profile/create',
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Persist ORCID data in the token
      if (account && profile) {
        token.orcidId = (profile as any).orcidId || (profile as any).orcid || (profile as any).sub
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Send ORCID data to the client
      if (token) {
        session.user.orcidId = token.orcidId as string
        session.user.accessToken = token.accessToken as string
      }
      return session
    },
    async signIn() {
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/auth/signin')) {
        return `${baseUrl}/profile/create`
      }
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}