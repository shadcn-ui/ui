"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton, CopyWithClassNames } from "@/components/copy-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ComponentExampleProps extends React.HTMLAttributes<HTMLDivElement> {
  extractClassname?: boolean
  extractedClassNames?: string
}

export function ComponentExample({
  children,
  className,
  extractClassname,
  extractedClassNames,
  ...props
}: ComponentExampleProps) {
  const [Example, Code, ...Children] = React.Children.toArray(
    children
  ) as React.ReactElement[]

  const codeString = React.useMemo(() => {
    if (
      typeof Code?.props["data-rehype-pretty-code-fragment"] !== "undefined"
    ) {
      const [, Button] = React.Children.toArray(
        Code.props.children
      ) as React.ReactElement[]
      return Button?.props?.value || null
    }
  }, [Code])

  return (
    <div
      className={cn("group relative my-4 flex flex-col space-y-2", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="mr-auto w-full">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          {extractedClassNames ? (
            <CopyWithClassNames
              value={codeString}
              classNames={extractedClassNames}
              className="border-none"
            />
          ) : (
            codeString && <CopyButton value={codeString} />
          )}
        </div>
        <TabsContent value="preview" className="p-0">
          <div className="flex min-h-[350px] items-center justify-center p-10">
            {Example}
          </div>
        </TabsContent>
        <TabsContent value="code" className="border-none p-0">
          <div className="flex flex-col space-y-4">
            <div className="w-full rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto [&_button]:hidden">
              {Code}
            </div>
            {Children && (
              <div className="rounded-md [&_pre]:my-0 [&_pre]:max-h-[350px] [&_pre]:overflow-auto [&_button]:hidden">
                {Children}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
