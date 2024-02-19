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

        console.log(parsedCredentials.success)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await getUser({ email })
          console.log("returned user")
          console.log(user)
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
  console.log("entering in auth")
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

    console.log(user)
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
