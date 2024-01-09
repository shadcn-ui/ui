"use server"
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

type User = {id:string}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        console.log(credentials)
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
          console.log('authorizeokok',parsedCredentials.success)
          if (parsedCredentials.success){
            const {email} = parsedCredentials.data
            if (email === "raoulcheck78@gmail.com"){
              const user:User={id:""}
              return user
            }

          }
          return null
      },
    }),
  ],
});