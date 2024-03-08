"use client"

import React from "react"
import { Index } from "@/__registry__"

import { useConfig } from "@/hooks/use-config"

export default function PreviewComponentOverview({ name }: { name: string }) {
  const [config] = useConfig()
  const Preview = React.useMemo(() => {
    const Component = Index[config.style][name]?.component

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component{" "}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {name}
          </code>{" "}
          not found in registry.
        </p>
      )
    }

    return <Component />
  }, [name, config.style])

  return Preview
}
