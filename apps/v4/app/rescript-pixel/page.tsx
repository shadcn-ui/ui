"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"

import { getScenario, scenarioIds, type Impl } from "./scenarios"

function getImpl(value: string | null): Impl {
  return value === "rescript" ? "rescript" : "tsx"
}

export default function RescriptPixelPage() {
  const searchParams = useSearchParams()
  const component = searchParams.get("component") ?? scenarioIds[0]
  const impl = getImpl(searchParams.get("impl"))

  React.useEffect(() => {
    try {
      localStorage.setItem("theme", "light")
      document.documentElement.classList.remove("dark")
    } catch {
      // noop
    }
  }, [])

  const scenario = React.useMemo(() => getScenario(component), [component])

  if (!scenario) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground">
        <div className="rounded-lg border bg-card p-4 text-sm">
          Unknown component: <code>{component}</code>
          <div className="mt-3">Supported components:</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {scenarioIds.map((id) => (
              <code key={id} className="rounded bg-muted px-2 py-1 text-xs">
                {id}
              </code>
            ))}
          </div>
        </div>
      </main>
    )
  }

  const render = impl === "tsx" ? scenario.renderTsx : scenario.renderRescript

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div id="pixel-metadata" data-component={component} data-impl={impl} />
      <div
        id="pixel-capture-root"
        className="mx-auto flex min-h-[740px] max-w-6xl items-start justify-center rounded-xl border bg-card p-10"
      >
        {render()}
      </div>
    </main>
  )
}
