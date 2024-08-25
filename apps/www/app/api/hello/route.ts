import { NextResponse, type NextRequest } from "next/server"

import { RegistryEntry } from "@/registry/schema"

export async function GET(request: NextRequest) {
  const payload: RegistryEntry = {
    name: "test",
    type: "registry:ui",
    description: "test",
    dependencies: [],
    devDependencies: [],
    registryDependencies: [
      "http://localhost:3333/registry/styles/new-york/button.json",
      "input-otp",
      "use-media-query",
    ],
    files: [
      {
        path: "component/hello.tsx",
        type: "registry:component",
        content:
          "export function Hello() { return <div className='text-foobar'>Hello</div> }",
      },
    ],
    tailwind: {
      config: {
        theme: {
          extend: {
            colors: {
              foobar: "var(--foobar)",
            },
          },
        },
      },
    },
    cssVars: {
      light: {
        "--foobar": "rgb(0, 0, 255)",
      },
      dark: {
        "--foobar": "rgb(255, 255, 255)",
      },
    },
  }

  return NextResponse.json(payload)
}
