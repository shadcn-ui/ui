import { NextApiRequest, NextApiResponse } from "next"

import components from "./components.json"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end()
  }

  return res.status(200).json(components)
}
