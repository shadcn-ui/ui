import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      
      return !!auth?.user;

    },
  },
  providers: [], 
} satisfies NextAuthConfig;