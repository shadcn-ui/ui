import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const body = await request.json()
  await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      priceWithoutTax: body.priceWithoutTax,
      taxRate: body.taxRate,
      taxAmount: body.taxAmount,
      priceWithTax: body.priceWithTax,
      status: body.status,
      currency: body.currency,
      unit: body.unit,
      hidden: body.hidden,
    },
  })

  return NextResponse.json({
    appUrl: process.env.APP_URL,
  })
}

export async function DELETE(request: NextRequest) {
  const body = await request.json()
  console.log({ body })

  await prisma.product.delete({
    where: {
      id: body.id,
    },
  })

  return NextResponse.json({
    appUrl: process.env.APP_URL,
  })
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  await prisma.product.update({
    where: {
      id: body.id,
    },
    data: {
      ...body,
    },
  })

  return NextResponse.json({
    status: "ok",
  })
}

export async function GET(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("productId"))
  const product = await prisma.product.findFirst({
    where: {
      id,
    },
  })

  return NextResponse.json({
    product,
  })
}
