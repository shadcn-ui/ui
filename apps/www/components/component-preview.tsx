"use client"

import * as React from "react"
import { Index } from "@/__registry__"
import { Badge } from "@/registry/default/ui/badge"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/default/ui/tabs"
import { styles } from "@/registry/styles"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { CopyButton, CopyWithClassNames } from "@/components/copy-button"

interface ComponentPreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  extractClassname?: boolean
  extractedClassNames?: string
  align?: "center" | "start" | "end"
}

export function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = "center",
  ...props
}: ComponentPreviewProps) {
  const [config] = useConfig()
  const style = styles.find((style) => style.name === config.style)
  const index = styles.findIndex((style) => style.name === config.style)

  const Codes = React.Children.toArray(children) as React.ReactElement[]
  const Code = Codes[index]

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

  const codeString = React.useMemo(() => {
    if (
      typeof Code?.props["data-rehype-pretty-code-fragment"] !== "undefined"
    ) {
      const [, Button] = React.Children.toArray(
        Code.props.children
      ) as React.ReactElement[]
      return Button?.props?.value || Button?.props?.__rawString__ || null
    }
  }, [Code])

  return (
    <div
      className={cn("group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="relative mr-auto w-full">
        <div className="flex items-center justify-between pb-3">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="preview"
              className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
          {extractedClassNames ? (
            <CopyWithClassNames
              value={codeString}
              classNames={extractedClassNames}
              className="absolute right-4 top-20"
            />
          ) : (
            codeString && (
              <CopyButton
                value={codeString}
                className="absolute right-4 top-20"
              />
            )
          )}
        </div>
        <TabsContent value="preview" className="relative rounded-md border">
          <div
            className={cn("preview flex min-h-[350px] justify-center p-10", {
              "items-center": align === "center",
              "items-start": align === "start",
              "items-end": align === "end",
            })}
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              {Preview}
            </React.Suspense>
          </div>
          {style && (
            <span className="absolute left-4 top-5 text-xs font-medium text-muted-foreground">
              {style.label}
            </span>
          )}
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_button]:hidden [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
