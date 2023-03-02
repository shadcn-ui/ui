import fs from "fs"
import path, { basename } from "path"
import { NextApiRequest, NextApiResponse } from "next"
import { allDocs } from "@/.contentlayer/generated"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  const components = allDocs
    .filter((doc) => doc.component && doc.files?.length)
    .map((doc) => {
      const files = doc.files?.map((file) => {
        const content = fs.readFileSync(path.join(process.cwd(), file), "utf8")

        return {
          name: basename(file),
          content,
        }
      })

      return {
        name: doc.title,
        dependencies: doc.dependencies,
        files,
      }
    })
    .sort((a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })

  return res.status(200).json(components)
}
