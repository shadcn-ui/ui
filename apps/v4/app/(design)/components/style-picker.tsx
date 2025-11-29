"use client"

import * as React from "react"
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
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a style" />
      </SelectTrigger>
      <SelectContent position="item-aligned">
        {styles.map((style) => (
          <SelectItem key={style.name} value={style.name}>
            {style.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
