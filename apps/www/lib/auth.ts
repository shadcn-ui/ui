import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { MultiTenantAdapter } from "./adapter/multitenant"
import { NextAuthOptions } from "next-auth"
import { Resend } from "resend"
import WelcomeEmail from "@/components/emails/welcome-email"
import env from "@/lib/env"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  // @ts-ignore
  adapter: MultiTenantAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
    EmailProvider({
      from: env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier, url }) => {
        const resend = new Resend(env.RESEND_API_KEY)

        const user = await prisma.user.findUnique({
          where: {
            email: identifier,
          },
          select: {
            emailVerified: true,
          },
        })

        if (user?.emailVerified) {
          await resend.sendEmail({
            from: String(env.EMAIL_FROM),
            to: identifier,
            subject: "Welcome back to APP",
            react: WelcomeEmail({
              title: `Welcome back to APP`,
              content: `Here's the magic link to sign in:`,
              url,
            }),
          })

          return
        }

        await resend.sendEmail({
          from: String(env.EMAIL_FROM),
          to: identifier,
          subject: "Welcome to APP",
          react: WelcomeEmail({
            title: `Welcome to APP`,
            content: `Thanks for trying APP. We are thrilled to have you on board.`,
            url,
          }),
        })
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      }
    },
  },
}
