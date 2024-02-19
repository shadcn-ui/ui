import { PrismaClient, Status } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"
import type { NextAuthConfig } from "next-auth"

const prisma = new PrismaClient().$extends(withAccelerate())

export const authConfig = {
  pages: {
    signIn: "/signIn",
  },
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isSignedIn = !!auth?.user
      if (nextUrl.pathname.startsWith("/onBoarding")) {
        if (isSignedIn) {
          const user = await prisma.user.findFirst({
            where: { email: auth.user?.email! },
          })
          if (user?.status === Status.active) {
            return false
          }
          return Response.redirect(
            new URL(`/onBoarding?onBoardingId=${user!.onBoardingId}`)
          )
        }
        return true
      }
      console.log({ isSignedIn })
      return isSignedIn
    },
  },
  providers: [],
} satisfies NextAuthConfig
