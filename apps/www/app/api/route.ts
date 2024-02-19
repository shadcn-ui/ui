import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const onBoardingId = request.nextUrl.searchParams.get("onBoardingId")

  const user = await prisma.user.findFirst({
    where: { onBoardingId: onBoardingId! },
  })

  return NextResponse.json({
    email: user!.email,
    status: user!.status,
  })
}
