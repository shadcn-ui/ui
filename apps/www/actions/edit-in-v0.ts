"use server"

import { track } from "@vercel/analytics/server"
import { capitalCase } from "change-case"
import { z } from "zod"

import { Style } from "@/registry/registry-styles"
import { registryEntrySchema, registryItemTypeSchema } from "@/registry/schema"

async function getRegistryItem(name: string, style: Style["name"]) {
  const registryURL = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/r/styles/${style}/${name}.json`
  )
  const response = await fetch(registryURL)

  if (!response.ok) {
    return null
  }

  const data = await response.json()

  const result = registryEntrySchema
    .extend({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string().optional(),
          type: registryItemTypeSchema,
          target: z.string().optional(),
        })
      ),
    })
    .safeParse(data)

  if (!result.success) {
    console.error(result.error)
    return null
  }

  return result.data
}

export async function editInV0({
  name,
  style,
  url,
}: {
  name: string
  style?: Style["name"]
  url: string
}) {
  style = style ?? "new-york"
  try {
    const registryItem = await getRegistryItem(name, style)

    if (!registryItem) {
      return { error: "Something went wrong. Please try again later." }
    }

    await track("edit_in_v0", {
      name,
      title: registryItem.name,
      description: registryItem.description ?? registryItem.name,
      style,
      url,
    })

    // const payload = {
    //   title: registryItem.name,
    //   description: registryItem.description ?? registryItem.name,
    //   code: registryItem.files?.[0]?.content,
    //   source: {
    //     title: "shadcn/ui",
    //     url,
    //   },
    //   meta: {
    //     project: capitalCase(name.replace(/\d+/g, "")),
    //     file: `${name}.tsx`,
    //   },
    // }

    // Remove v0 prefix from the name
    registryItem.name = registryItem.name.replace(/^v0-/, "")

    const payload = {
      version: 2,
      payload: registryItem,
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
