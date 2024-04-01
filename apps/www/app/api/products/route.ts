import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

export const fetchCache = "force-no-store"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany({})

  return NextResponse.json({
    products,
  })
}
