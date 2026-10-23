"use client"

import { useEffect } from "react"

type WebMcpTool = {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: { path: string }) => Promise<{ content: Array<{ type: "text"; text: string }> }>
}

type ModelContext = {
  provideContext: (context: { tools: WebMcpTool[]; signal?: AbortSignal }) => void | Promise<void>
}

declare global {
  interface Navigator {
    modelContext?: ModelContext
  }

  interface Document {
    modelContext?: ModelContext
  }
}

const allowedPaths = new Set([
  "/",
  "/docs",
  "/docs/installation",
  "/docs/components",
  "/docs/mcp",
  "/docs/directory",
])

export function WebMcp() {
  useEffect(() => {
    const modelContext = navigator.modelContext ?? document.modelContext
    if (!modelContext) return

    const controller = new AbortController()
    const tools: WebMcpTool[] = [
      {
        name: "navigate_shadcn",
        description: "Navigate the shadcn/ui site to a documentation or component page.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              enum: [...allowedPaths],
              description: "A supported shadcn/ui site path.",
            },
          },
          required: ["path"],
          additionalProperties: false,
        },
        execute: async ({ path }) => {
          if (!allowedPaths.has(path)) {
            throw new Error("That shadcn/ui path is not available through WebMCP.")
          }
          window.location.assign(path)
          return { content: [{ type: "text", text: `Navigating to ${path}.` }] }
        },
      },
    ]

    void modelContext.provideContext({ tools, signal: controller.signal })
    return () => controller.abort()
  }, [])

  return null
}
