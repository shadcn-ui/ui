import { PrismaClient, User } from "@prisma/client"

const prisma = new PrismaClient()

export const createUser = async (user: User) => {
  await prisma.user.create({
    data: user,
  })
}

export const getUser = async (partialUser: Partial<User>) => {
  const user = await prisma.user.findFirst({
    where: partialUser,
  })
  return user
}

export const updateUserByOnBoardingId = async (
  onBoardingId: string,
  partialUser: Partial<User>
) => {
  const user = await prisma.user.updateMany({
    where: { onBoardingId },
    data: partialUser,
  })
  return user
}
