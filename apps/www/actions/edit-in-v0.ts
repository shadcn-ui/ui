"use server"

import { track } from "@vercel/analytics/server"
import { capitalCase } from "change-case"

export async function editInV0({
  name,
  title,
  description,
  style,
  code,
  url,
}: {
  name: string
  title?: string
  description: string
  style: string
  code: string
  url: string
}) {
  try {
    title =
      title ??
      capitalCase(
        name.replace(/\d+/g, "").replace("-demo", "").replace("-", " ")
      )

    await track("edit_in_v0", {
      name,
      title,
      description,
      style,
      url,
    })

    // Replace "use client" in the code.
    // v0 will handle this for us.
    // code = code.replace(`"use client"`, "")

    // Remove export const description = "..."
    code = code.replace(/export const description =\s*".*";?/, "")

    const payload = {
      title,
      description,
      code,
      source: {
        title: "shadcn/ui",
        url,
      },
      meta: {
        project: capitalCase(name.replace(/\d+/g, "")),
        file: `${name}.tsx`,
      },
    }

    const response = await fetch(`${process.env.V0_URL}/chat/api/open-in-v0`, {
      method: "POST",
      body: JSON.stringify(payload),
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

      console.error(response.statusText)

      throw new Error("Something went wrong. Please try again later.")
    }

    const result = await response.json()

    return {
      ...result,
      url: `${process.env.V0_URL}/chat/api/open-in-v0/${result.id}`,
    }
  } catch (error) {
    console.error(error)
    if (error instanceof Error) {
      return { error: error.message }
    }
  }
}
