import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

import type { NextAuthConfig, Session } from 'next-auth'

export interface EnrichedSession extends Session {
  accessToken: string
  refreshToken: string
  accessTokenExpiresAt: number
  accessTokenIssuedAt: number
}

export const config = {
  providers: [
    Google({
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          scope: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/calendar',
          ].join(' '),
          response: 'code',
        },
      },
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          access_token: account.access_token,
          issued_at: Date.now(),
          expires_at: Date.now() + Number(account.expires_in) * 1000, // 1 hora
          refresh_token: account.refresh_token,
        }
      } else if (Date.now() < Number(token.expires_at)) {
        return token
      } else {
        try {
          const response = await fetch('https://oauth2.googleapis.com/token', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID as string,
              client_secret: process.env.AUTH_GOOGLE_SECRET as string,
              grant_type: 'refresh_token',
              refresh_token: token.refresh_token as string,
            }),
            method: 'POST',
          })

          const tokens = await response.json()

          if (!response.ok) throw tokens

          return {
            ...token,
            access_token: tokens.access_token,
            expires_at: Date.now() + Number(tokens.expires_in) * 1000,
            refresh_token: tokens.refresh_token ?? token.refresh_token,
          }
        } catch (error) {
          console.error('Erro no refresh do access token', error)
          return { ...token, error: 'RefreshAccessTokenError' as const }
        }
      }
    },
    async session({ session, token }) {
      // console.log('Sessão: ', session)
      return {
        ...session,
        accessToken: String(token.access_token),
        refreshToken: token.refresh_token ? String(token.refresh_token) : '',
        accessTokenIssuedAt: Number(token.issued_at),
        accessTokenExpiresAt: Number(token.expires_at),
      } satisfies EnrichedSession
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
