import { NextResponse } from "next/server"

const catalog = {
  specVersion: "1.0",
  host: {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com",
  },
  entries: [
    {
      identifier: "urn:air:ui.shadcn.com:documentation:markdown",
      displayName: "shadcn/ui documentation",
      type: "text/markdown",
      url: "https://ui.shadcn.com/docs/installation.md",
      representativeQueries: [
        "How do I install shadcn/ui?",
        "Show me the shadcn/ui component documentation",
      ],
    },
    {
      identifier: "urn:air:ui.shadcn.com:registry:catalog",
      displayName: "shadcn/ui component registry",
      type: "application/json",
      url: "https://ui.shadcn.com/r/index.json",
      representativeQueries: [
        "What components are available in shadcn/ui?",
        "Find a shadcn/ui component by name",
      ],
    },
    {
      identifier: "urn:air:ui.shadcn.com:mcp:server",
      displayName: "shadcn MCP server",
      type: "application/json",
      url: "https://ui.shadcn.com/.well-known/mcp/server-card.json",
      representativeQueries: [
        "How can an agent use the shadcn MCP server?",
        "Configure shadcn MCP for an AI coding assistant",
      ],
    },
  ],
}

export function GET() {
  return NextResponse.json(catalog, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
