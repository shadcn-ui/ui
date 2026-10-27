import { NextResponse } from "next/server"

const serverCard = {
  serverInfo: {
    name: "shadcn",
    version: "4.21.0",
  },
  description:
    "Browse, search, and install components from shadcn-compatible registries.",
  transport: {
    type: "stdio",
    command: "npx",
    args: ["shadcn@latest", "mcp"],
  },
  capabilities: {
    tools: true,
  },
  documentation: "https://ui.shadcn.com/docs/mcp",
}

export function GET() {
  return NextResponse.json(serverCard, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
