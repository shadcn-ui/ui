"use client"

import * as React from "react"
import { Components } from "@/registry/components"

import { cn } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CopyButton, CopyWithClassNames } from "@/components/copy-button"

interface ComponentExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof typeof Components
  extractClassname?: boolean
  extractedClassNames?: string
  align?: "center" | "start" | "end"
  src?: string
}

export function ComponentPreview({
  name,
  children,
  className,
  extractClassname,
  extractedClassNames,
  align = "center",
  src: _,
  ...props
}: ComponentExampleProps) {
  const [config] = useConfig()

  const [Code, ...Children] = React.Children.toArray(
    children
  ) as React.ReactElement[]

  const Preview = React.useMemo(() => {
    const Component = Components[name]?.["components"][config.style]

    if (!Component) {
      return null
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
        <TabsContent value="preview" className="rounded-md border">
          <div
            className={cn("flex min-h-[350px] justify-center p-10", {
              "items-center": align === "center",
              "items-start": align === "start",
              "items-end": align === "end",
            })}
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              {Preview}
            </React.Suspense>
          </div>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_button]:hidden [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
              {Code}
            </div>
            {Children?.length ? (
              <div className="rounded-md [&_button]:hidden [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto">
                {Children}
              </div>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
