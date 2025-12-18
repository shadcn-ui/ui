import type { NextRequest } from "next/server"
import { generateRegistryRssFeed } from "@wandry/analytics-sdk"

export const revalidate = 3600

export async function GET(request: NextRequest) {
  const baseUrl = new URL(request.url).origin

  const rssXml = await generateRegistryRssFeed({
    baseUrl,
    componentsUrl: "docs/components",
    blocksUrl: (itemName) => {
      /**
       * This is necessary in order to correctly select the link to the block.
       * Since you do not have a separate link to the block, but only to the block category,
       * I made it possible to obtain the category from the block
       */
      const category = itemName.split("-")[0]
      return `blocks/${category}`
    },
    rss: {
      title: "shadcn/ui",
      description:
        "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code",
      link: "https://ui.shadcn.com/",
      endpoint: "/rss.xml",
      pubDateStrategy: "githubLastEdit",
    },
    registry: {
      path: "r/styles/default/registry.json",
    },
    /**
     * I excluded these types of elements because I couldn't find any pages for them.
     * */
    excludeItemTypes: ["registry:internal", "registry:example"],
    github: {
      owner: "shadcn-ui",
      repo: "ui",
      /**
       *
       * You need to enter your GitHub token here.
       * I don't store it anywhere.
       * It is needed to send a request to the GitHub API and get the date of the last commit for the registry item.
       * This is necessary to generate a valid date of change for the item.
       *
       */
      token: process.env.GITHUB_TOKEN,
    },
  })

  if (!rssXml) {
    return new Response("RSS feed not available", {
      status: 404,
      headers: { "Content-Type": "text/plain" },
    })
  }

  return new Response(rssXml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
