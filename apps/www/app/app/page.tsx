"use client"

import { useEffect, useState } from "react"
import { auth } from "@/auth"
import { PrismaClient, Product } from "@prisma/client"

import { columns } from "../examples/tasks/components/columns"
import { DataTable } from "../examples/tasks/components/data-table"

const prisma = new PrismaClient()

export default async function IndexPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const getProducts = async () => {
      const products = await fetch(`/api/products`)

      setProducts((await products.json()).products)
    }
    getProducts()
  }, [])

  return (
    <div className="container  py-10">
      <DataTable data={products} columns={columns} setProducts={setProducts} />
    </div>
  )
}
