"use server"

import { track } from "@vercel/analytics/server"

export async function editInV0({
  name,
  description,
  code,
}: {
  name: string
  description: string
  code: string
}) {
  await track("edit_in_v0", {
    name,
    description,
  })

  const url = `${process.env.V0_URL}/api/edit`
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify({ description, code, source: "ui.shadcn.com" }),
    headers: {
      "x-v0-edit-secret": process.env.V0_EDIT_SECRET!,
      "x-vercel-protection-bypass":
        process.env.DEPLOYMENT_PROTECTION_BYPASS || "not-set",
      "Content-Type": "application/json",
    },
  })

  if (response.ok) {
    return await response.json()
  }

  return null
}
