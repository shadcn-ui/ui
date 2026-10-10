import { NextResponse } from "next/server"

const index = {
  $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  skills: [
    {
      name: "shadcn-ui",
      type: "skill-md",
      description:
        "Use shadcn/ui documentation and registries to discover, configure, and install components.",
      url: "/.well-known/agent-skills/shadcn-ui/SKILL.md",
      digest: "sha256:6d2d275cf79d73a337c2711ba637d4575560d14f9b907c1eb12258d8fda0f241",
    },
  ],
}

export function GET() {
  return NextResponse.json(index, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
