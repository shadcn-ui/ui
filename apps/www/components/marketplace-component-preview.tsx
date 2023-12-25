"use client"

import * as React from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { ThemeWrapper } from "@/components/theme-wrapper"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"

import { Code, Pre } from "./custom-mdx-remote"

type MarketplacePreviwProps = React.HTMLAttributes<HTMLDivElement> & {
  code: string[]
  name: string
} & ({ children: JSX.Element } | { image: string })

export const MarketplacePreviw = (Props: MarketplacePreviwProps) => {
  const { code, className, ...props } = Props
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
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Preview
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="relative h-9 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="preview" className="relative rounded-md border">
          <ThemeWrapper defaultTheme="zinc">
            <div
              className={cn(
                "preview flex min-h-[350px] w-full items-center justify-center p-10"
              )}
            >
              {"image" in Props ? (
                <Image
                  src={Props.image}
                  alt={`shadcn-ui preview of ${Props.name}`}
                  width={1000}
                  height={1000}
                />
              ) : Props.children
              }
            </div>
          </ThemeWrapper>
        </TabsContent>
        <TabsContent value="code">
          <div className="flex flex-col">
            {code.map((e, i) => (
              <Pre key={i}>
                <Code>{e}</Code>
              </Pre>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
