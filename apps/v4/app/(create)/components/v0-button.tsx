"use client"

import { useQueryStates } from "nuqs"

import { Icons } from "@/components/icons"
import { Button } from "@/registry/new-york-v4/ui/button"
import { designSystemSearchParams } from "@/app/(create)/lib/search-params"

export function V0Button({ base }: { base: string }) {
  const [params] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/create/v0?base=${base}&style=${params.style}&baseColor=${params.baseColor}&theme=${params.theme}&iconLibrary=${params.iconLibrary}&font=${params.font}&menuAccent=${params.menuAccent}&menuColor=${params.menuColor}&radius=${params.radius}&item=${params.item}`

  console.log(url)

  return (
    <Button
      size="sm"
      variant="outline"
      className="rounded-lg shadow-none"
      asChild
    >
      <a
        href={`${process.env.NEXT_PUBLIC_V0_URL}/chat/api/open?url=${url}`}
        target="_blank"
      >
        Open in <Icons.v0 className="size-5" />
      </a>
    </Button>
  )
}
