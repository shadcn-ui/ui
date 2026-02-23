import Link from "next/link"

import { Atom } from "@/components/lo-fi/atom"

function Component({ href, ...props }: React.ComponentProps<typeof Link>) {
  return <Link href={href} className="group flex flex-col gap-2" {...props} />
}

function ComponentContent({ ...props }: React.ComponentProps<typeof Atom>) {
  return (
    <Atom
      shade="50"
      className="bg-muted/30 ring-muted flex aspect-video items-center justify-center rounded-lg p-4 ring *:w-full *:max-w-[70%]"
      {...props}
    />
  )
}

function ComponentName({ ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className="text-foreground text-center font-medium underline-offset-2 group-hover:underline"
      {...props}
    />
  )
}

export { Component, ComponentContent, ComponentName }
