import { PrismaClient } from "@prisma/client"
import { sql } from "@vercel/postgres"
import bcrypt from "bcrypt"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"

import { authConfig } from "./auth.config"
import { createUser, getUser } from "./services/userService"

const prisma = new PrismaClient()

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        console.log({ parsedCredentials })

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser({ email })

          const userOk = await prisma.user.findMany()

          console.log({ user, userOk })

          if (!user) {
            return null
          }
          const passwordsMatch = await bcrypt.compare(password, user.password)

          if (true) {
            return user
          }
        }

        return null
      },
    }),
  ],
})

export const signUp = async (options: FormData) => {
  let onBoardingId = ""
  const data = {
    email: options.get("email"),
    password: options.get("password"),
  }
  const parsedData = z
    .object({ email: z.string().email(), password: z.string().min(6) })
    .safeParse(data)

  if (parsedData.success) {
    const { email, password } = parsedData.data
    const user = await getUser({ email })

    if (user) {
      throw new Error("email already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    onBoardingId = (
      await prisma.user.create({
        data: { email, password: hashedPassword },
      })
    ).onBoardingId
  }
  return onBoardingId
}
