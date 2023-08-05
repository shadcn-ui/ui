import { GlobalRole, PrismaClient } from "@prisma/client"

import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { User } from "next-auth"

interface AdapterUser extends User {
  id: string
  email: string
  emailVerified: Date | null
}

export function MultiTenantAdapter(prisma: PrismaClient) {
  const prismaAdapter = PrismaAdapter(prisma)

  return {
    ...prismaAdapter,
    createUser: (data: Omit<AdapterUser, "id">) => {
      const isSuperAdmin = process.env.SUPER_ADMIN_EMAIL === data.email

      return prisma.user.create({
        data: {
          ...data,
          role: isSuperAdmin ? GlobalRole.SUPERADMIN : GlobalRole.CUSTOMER,
          memberships: {
            create: {
              role: "OWNER",
              organization: {
                create: {
                  name: data.email,
                },
              },
            },
          },
        },
        include: { memberships: true },
      })
    },
  }
}
