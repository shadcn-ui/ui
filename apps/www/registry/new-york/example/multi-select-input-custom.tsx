"use client"

import { useRef, useState } from "react"

import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectEmpty,
  MultiSelectList,
  MultiSelectSearch,
  MultiSelectTrigger,
  MultiSelectValue,
  renderMultiSelectOptions,
  type MultiSelectOption,
  type MultiSelectOptionGroup,
} from "@/registry/new-york/ui/multi-select"

const ALL_ITEMS = [
  { value: "react", label: "React", group: "React" },
  { value: "next", label: "Next.js", group: "React" },
  { value: "remix", label: "Remix", group: "React" },
  { value: "vue", label: "Vue", group: "Vue" },
  { value: "nuxt", label: "Nuxt.js", group: "Vue" },
  { value: "angular", label: "Angular", group: "Others" },
  { value: "svelte", label: "Svelte", group: "Others" },
]

const group = (
  options: Array<(typeof ALL_ITEMS)[number]>
): MultiSelectOptionGroup[] => {
  return options.reduce((acc, item) => {
    const group = acc.find((g) => g.heading === item.group)
    if (group) {
      group.children.push(item)
    } else {
      acc.push({ heading: item.group, children: [item] })
    }
    return acc
  }, [] as MultiSelectOptionGroup[])
}

const search = async (keyword?: string) => {
  if (!keyword) return group(ALL_ITEMS)
  const lowerKeyword = keyword.toLowerCase()
  const filtered = ALL_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(lowerKeyword)
  )

  if (!filtered.length) {
    return [
      {
        label: keyword,
        value: keyword,
      },
    ]
  }

  return group(filtered)
}

export default function MultiSelectInputCustomDemo() {
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<MultiSelectOption[]>(() =>
    group(ALL_ITEMS)
  )

  const indexRef = useRef(0)

  const handleSearch = async (keyword: string) => {
    const index = ++indexRef.current
    setLoading(true)
    const newOptions = await search(keyword)
    if (indexRef.current === index) {
      setOptions(newOptions)
      setLoading(false)
    }
  }

  return (
    <MultiSelect onSearch={handleSearch}>
      <MultiSelectTrigger className="w-96">
        <MultiSelectValue placeholder="Select stack" />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectSearch placeholder="input any..." />
        <MultiSelectList>
          {loading ? null : renderMultiSelectOptions(options)}
          <MultiSelectEmpty>
            {loading ? "Loading..." : "No results found"}
          </MultiSelectEmpty>
        </MultiSelectList>
      </MultiSelectContent>
    </MultiSelect>
  )
}
