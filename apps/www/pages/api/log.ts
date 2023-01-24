import { NextApiRequest, NextApiResponse } from "next"
import LogSnag from "logsnag"

import { logSchema } from "@/lib/validations/log"

const logsnag = new LogSnag({
  token: process.env.LOGSNAG_TOKEN || "",
  project: "ui",
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end()
  }

  try {
    const log = logSchema.parse(req.body)

    await logsnag.publish({
      channel: "copy-code",
      event: log.event,
      tags: {
        ...log.data,
      },
    })

    return res.end()
  } catch (error) {
    console.error(error)
    return res.status(400).end()
  }
}
