"use server"

import { track } from "@vercel/analytics/server"

const EDIT_IN_V0_SOURCE = "ui.shadcn.com"

export async function editInV0({
  name,
  description,
  style,
  code,
}: {
  name: string
  description: string
  style: string
  code: string
}) {
  try {
    await track("edit_in_v0", {
      name,
      description,
      style,
    })

    const response = await fetch(`${process.env.V0_URL}/api/edit`, {
      method: "POST",
      body: JSON.stringify({ description, code, source: EDIT_IN_V0_SOURCE }),
      headers: {
        "x-v0-edit-secret": process.env.V0_EDIT_SECRET!,
        "x-vercel-protection-bypass":
          process.env.DEPLOYMENT_PROTECTION_BYPASS || "not-set",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Unauthorized")
      }

      throw new Error("Something went wrong. Please try again later.")
    }

    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}
