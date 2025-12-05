"use client"

import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { MENU_ACCENTS, type MenuAccentValue } from "@/app/(design)/lib/config"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function MenuAccentPicker() {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentAccent = MENU_ACCENTS.find(
    (accent) => accent.value === params.menuAccent
  )

  return (
    <Select
      value={currentAccent?.value}
      onValueChange={(value) => {
        setParams({ menuAccent: value as MenuAccentValue })
      }}
    >
      <SelectTrigger className="relative">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs">Menu Accent</div>
            <div className="text-foreground text-sm font-medium">
              {currentAccent?.label}
            </div>
          </div>
          <div className="text-foreground absolute top-1/2 right-4 ml-auto flex size-4 -translate-y-1/2 items-center justify-center text-base">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="128"
              height="128"
              viewBox="0 0 24 24"
              fill="none"
              className="text-foreground"
            >
              <path
                d="M19 12.1294L12.9388 18.207C11.1557 19.9949 10.2641 20.8889 9.16993 20.9877C8.98904 21.0041 8.80705 21.0041 8.62616 20.9877C7.53195 20.8889 6.64039 19.9949 4.85726 18.207L2.83687 16.1811C1.72104 15.0622 1.72104 13.2482 2.83687 12.1294M19 12.1294L10.9184 4.02587M19 12.1294H2.83687M10.9184 4.02587L2.83687 12.1294M10.9184 4.02587L8.89805 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-accent={currentAccent?.value}
                className="data-[accent=bold]:fill-foreground fill-muted-foreground/30"
              ></path>
              <path
                d="M22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 20 17 20 17C20 17 22 18.8954 22 20Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-accent={currentAccent?.value}
                className="data-[accent=bold]:fill-foreground fill-muted-foreground/30"
              ></path>
            </svg>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        position="popper"
        side="left"
        align="start"
        className="ring-foreground/10 rounded-xl border-0 ring-1 data-[state=closed]:animate-none data-[state=open]:animate-none"
      >
        {MENU_ACCENTS.map((accent) => (
          <SelectItem
            key={accent.value}
            value={accent.value}
            className="rounded-lg"
          >
            {accent.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
