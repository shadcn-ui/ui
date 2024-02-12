import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/signIn',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      
      return !!auth?.user;

    },
  },
  providers: [], 
} satisfies NextAuthConfig;