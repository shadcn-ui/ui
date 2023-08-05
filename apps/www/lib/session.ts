import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"

export async function getCurrentUserSession() {
  const session = await getServerSession(authOptions)

  return session?.user
}

export type CurrentUser = Awaited<ReturnType<typeof getCurrentUserSession>>

export async function isProUser() {
  const session = await getServerSession(authOptions)
  const userId = session?.user.id

  if (!userId) {
    throw new Error("Unauthorized")
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      memberships: {
        select: {
          organization: {
            select: {
              stripeCustomerId: true,
              stripeSubscriptionId: true,
              stripeCurrentPeriodEnd: true,
              stripePriceId: true,
            },
          },
        },
      },
    },
  })
  const organization = user?.memberships[0].organization

  return Boolean(organization?.stripePriceId)
}
