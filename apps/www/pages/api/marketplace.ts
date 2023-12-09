import { NextApiRequest, NextApiResponse } from "next"

const data = {
  name: "rajat",
  description: "Description",
  type: "components:addons",
  // dependencies: [

  // ],
  registryDependencies: [
    "button"
  ],
  files: [
    {
      content: "Components built on top of Shadcn-UI & Radix UI primitives.",
      dir: "rajat",
      name: "index.tsx"
    },
    {
      content: "Components built on top of Shadcn-UI & Radix UI primitives.",
      dir: "rajat/modules",
      name: "types.d.ts"
    }
  ]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  return res.status(200).json(data)
}
