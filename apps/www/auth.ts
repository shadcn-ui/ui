import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"
import type { User } from "lib/definitions"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

import { authConfig } from "./auth.config"

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser(email)
          if (!user) {
            return null
          }
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (passwordsMatch) {
            return user
          }
        }

        return null
      },
    }),
  ],
})

export const signUp = async (options: FormData) => {
  const data = {
    email: options.get("email"),
    password: options.get("password"),
  }
  const parsedData = z
    .object({ email: z.string().email(), password: z.string().min(6) })
    .safeParse(data)

  if (parsedData.success) {
    const { email, password } = parsedData.data
    const user = await getUser(email)
    if (user) {
      throw new Error("email already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    await insertUser(email, hashedPassword)
  }
}

async function insertUser(email: string, password: string) {
  try {
    await sql<User>`
   INSERT INTO users (email, password)
   VALUES (${email}, ${password})
   ON CONFLICT (id) DO NOTHING;
 `
  } catch (error) {
    throw new Error("Failed to insert user.")
  }
}

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`
    return user.rows[0]
  } catch (error) {
    throw new Error("Failed to fetch user.")
  }
}
