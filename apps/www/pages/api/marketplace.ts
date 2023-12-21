import { PackageType, packageZod } from "@/lib/validations/packages"
import { db } from "@/server/db"
import { packages } from "@/server/db/schema"
import { eq, inArray } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  
  const name = req.query?.name as string
  
  if (name) {
    const data = await db.query.packages.findFirst({
      where: eq(packages.name, name)
    }) as PackageType

    const safeData = packageZod.parse(data)
    res.status(200).json([safeData])
  }
  else {
    const names = req.body.names as string[]

    console.log(names)

    const data = await db.query.packages.findMany({
      where: inArray(packages.name, names)

    }) as PackageType[]


    if (!data.length) return res.status(200).json([])

    const safeData = z.array(packageZod).parse(data)
    return res.status(200).json(safeData)
  }
}