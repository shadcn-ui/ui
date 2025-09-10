import { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/registry/new-york-v4/ui/button"
import { componentRegistry } from "@/app/(internal)/sink/component-registry"
import { ComponentWrapper } from "@/app/(internal)/sink/components/component-wrapper"

export const dynamic = "force-static"
export const revalidate = false

export const metadata: Metadata = {
  title: "Kitchen Sink",
  description: "A page with all components for testing purposes.",
}

export default function SinkPage() {
  return (
    <>
      <div className="@container grid flex-1 gap-4 p-4">
        {/* Component grid with all demos */}
        {Object.entries(componentRegistry).map(([key, component]) => {
          const Component = component.component
          return (
            <ComponentWrapper
              key={key}
              name={key}
              className={component.className || ""}
            >
              <Component />
            </ComponentWrapper>
          )
        })}
      </div>
      {/* Floating navigation panel */}
      <div className="bg-background fixed right-4 bottom-4 z-50 w-64 rounded-lg border p-4 shadow-lg">
        <h2 className="mb-3 text-sm font-semibold">Component Navigation</h2>
        <div className="max-h-96 overflow-y-auto">
          <div className="grid gap-1">
            {Object.entries(componentRegistry).map(([key, component]) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                className="justify-start"
                asChild
              >
                <Link href={`/sink/${key}`}>{component.name}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
