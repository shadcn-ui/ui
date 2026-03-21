"use client"

import {
  createListCollection,
  Select,
  SelectContent,
  SelectControl,
  SelectIndicator,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const collection = createListCollection({
  items: [
    { label: "Eastern Standard Time", value: "est", type: "North America" },
    { label: "Central Standard Time", value: "cst", type: "North America" },
    { label: "Mountain Standard Time", value: "mst", type: "North America" },
    { label: "Pacific Standard Time", value: "pst", type: "North America" },
    { label: "Alaska Standard Time", value: "akst", type: "North America" },
    { label: "Hawaii Standard Time", value: "hst", type: "North America" },
    { label: "Greenwich Mean Time", value: "gmt", type: "Europe & Africa" },
    { label: "Central European Time", value: "cet", type: "Europe & Africa" },
    { label: "Eastern European Time", value: "eet", type: "Europe & Africa" },
    {
      label: "Western European Summer Time",
      value: "west",
      type: "Europe & Africa",
    },
    { label: "Central Africa Time", value: "cat", type: "Europe & Africa" },
    { label: "East Africa Time", value: "eat", type: "Europe & Africa" },
    { label: "Moscow Time", value: "msk", type: "Asia" },
    { label: "India Standard Time", value: "ist", type: "Asia" },
    { label: "China Standard Time", value: "cst_china", type: "Asia" },
    { label: "Japan Standard Time", value: "jst", type: "Asia" },
    { label: "Korea Standard Time", value: "kst", type: "Asia" },
    {
      label: "Indonesia Central Standard Time",
      value: "ist_indonesia",
      type: "Asia",
    },
    {
      label: "Australian Western Standard Time",
      value: "awst",
      type: "Australia & Pacific",
    },
    {
      label: "Australian Central Standard Time",
      value: "acst",
      type: "Australia & Pacific",
    },
    {
      label: "Australian Eastern Standard Time",
      value: "aest",
      type: "Australia & Pacific",
    },
    {
      label: "New Zealand Standard Time",
      value: "nzst",
      type: "Australia & Pacific",
    },
    { label: "Fiji Time", value: "fjt", type: "Australia & Pacific" },
    { label: "Argentina Time", value: "art", type: "South America" },
    { label: "Bolivia Time", value: "bot", type: "South America" },
    { label: "Brasilia Time", value: "brt", type: "South America" },
    { label: "Chile Standard Time", value: "clt", type: "South America" },
  ],
  groupBy: (item) => item.type,
})

export function SelectScrollable() {
  return (
    <Select collection={collection}>
      <SelectControl className="w-full max-w-64">
        <SelectTrigger>
          <SelectValue placeholder="Select a timezone" />
        </SelectTrigger>
        <SelectIndicator />
      </SelectControl>
      <SelectContent>
        {collection.group().map(([type, group]) => (
          <SelectItemGroup key={type}>
            <SelectItemGroupLabel>{type}</SelectItemGroupLabel>
            {group.map((item) => (
              <SelectItem key={item.value} item={item}>
                <SelectItemText>{item.label}</SelectItemText>
                <SelectItemIndicator />
              </SelectItem>
            ))}
          </SelectItemGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
