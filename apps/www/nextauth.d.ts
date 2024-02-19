// nextauth.d.ts

import { User as PrismaUser } from "@prisma/client"
import { DefaultSession, User } from "next-auth"

// nextauth.d.ts
declare module "next-auth" {
  interface User extends PrismaUser {}

  interface Session extends DefaultSession {
    user?: User
  }
}
