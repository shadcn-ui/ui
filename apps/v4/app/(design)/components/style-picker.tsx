"use client"

import { useQueryStates } from "nuqs"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Style } from "@/registry/styles"
import { designSystemSearchParams } from "@/app/(design)/lib/search-params"

export function StylePicker({ styles }: { styles: readonly Style[] }) {
  const [params, setParams] = useQueryStates(designSystemSearchParams, {
    shallow: false,
    history: "push",
  })

  const currentStyle = styles.find((style) => style.name === params.style)

  return (
    <Select
      value={currentStyle?.name}
      onValueChange={(value) => {
        setParams({ style: value as Style["name"] })
      }}
    >
      <SelectTrigger className="w-full text-left data-[size=default]:h-14">
        <SelectValue>
          <div className="flex flex-col justify-start">
            <div className="text-muted-foreground text-xs font-medium">
              Style
            </div>
            {currentStyle?.title}
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" side="right" align="start">
        {styles.map((style) => (
          <SelectItem key={style.name} value={style.name}>
            {style.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
