import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  await prisma.user.create({
    data: {
      email: "raoulcheck78@gmail.com",
      password: await bcrypt.hash("123456", 10),
    },
  })

  const user = await prisma.user.findFirst()
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
