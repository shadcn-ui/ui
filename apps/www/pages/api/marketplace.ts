import { PackageType, packageZod } from "@/lib/validations/packages"
import { db } from "@/server/db"
import { packages } from "@/server/db/schema"
import { eq, inArray, sql } from "drizzle-orm"
import { NextApiRequest, NextApiResponse } from "next"
import { z } from "zod"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {


  const names: string[] = [...req?.body?.names, req.query?.name]

  if (!names.length)
    res.status(400).json({ message: "Component name is not provided" })

  const data = await db.update(packages).set({
    downloads: sql`${packages.downloads} + 1`,
  }).where(
    inArray(packages.name, names)
  ).returning()

  if (!data.length) return res.status(200).json([])

  const safeData = z.array(packageZod).parse(data)
  res.status(200).json(safeData)
}