export const example = `"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"

import { cn } from "@/lib/utils"

type ExampleContextProps = {
  content: string
}

const ExampleContext = React.createContext<ExampleContextProps | null>(null)

function ExampleProvider({
  value,
  ...props
}: React.PropsWithChildren<{
  value: ExampleContextProps
}>) {
  return (
    <ExampleContext.Provider value={value}>
      {props.children}
    </ExampleContext.Provider>
  )
}

function Example({
  content,
  className,
  ...props
}: ButtonPrimitive.Props & {
  content: string
}) {
  return (
    <ExampleProvider value={{ content }}>
      <ButtonPrimitive className={cn('p-2', className)} {...props} />
    </ExampleProvider>
  )
}

export { ExampleProvider, Example }
`
