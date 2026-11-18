"use client"

import { LinkSquare02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/base-nova/ui/tooltip"
import {
  CONTENT_OPTIONS,
  DEV_CONTENT_OPTIONS,
} from "@/app/(app)/(typeset)/lib/fixtures"
import {
  serializeTypesetSearchParams,
  useTypesetSearchParams,
  type TypesetSearchParams,
} from "@/app/(app)/(typeset)/lib/search-params"

type ItemValue = TypesetSearchParams["item"]

export function TypesetToolbar() {
  return (
    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-1.5">
      <div className="dark flex items-center gap-1 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
        {CONTENT_OPTIONS.map((option, index) => (
          <ItemPill
            key={option.value}
            value={option.value}
            label={option.label}
            number={index + 1}
          />
        ))}
        {process.env.NODE_ENV === "development" &&
        DEV_CONTENT_OPTIONS.length > 0 ? (
          <div className="hidden items-center gap-1 md:flex">
            <div className="mx-0.5 h-4 w-px bg-border" />
            {DEV_CONTENT_OPTIONS.map((option, index) => (
              <ItemPill
                key={option.value}
                value={option.value}
                label={option.label}
                number={CONTENT_OPTIONS.length + index + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="dark flex items-center gap-1 rounded-xl bg-card/90 p-1 shadow-xl backdrop-blur-xl">
        <OpenInNewTab />
      </div>
    </div>
  )
}

function ItemPill({
  value,
  label,
  number,
}: {
  value: ItemValue
  label: string
  number: number
}) {
  const [params, setParams] = useTypesetSearchParams()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            data-active={params.item === value}
            className="h-7 min-w-7 cursor-pointer rounded-lg px-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
            onClick={() => setParams({ item: value })}
          />
        }
      >
        {String(number).padStart(2, "0")}
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function OpenInNewTab() {
  const [params] = useTypesetSearchParams()
  const href = serializeTypesetSearchParams(
    `/preview/typeset/${params.item}`,
    params
  )

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="h-7 cursor-pointer rounded-lg px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <a href={href} target="_blank" rel="noreferrer">
        <HugeiconsIcon
          icon={LinkSquare02Icon}
          strokeWidth={2}
          className="size-3.5 md:hidden"
        />
        <span className="max-md:sr-only">Open in New Tab</span>
      </a>
    </Button>
  )
}
