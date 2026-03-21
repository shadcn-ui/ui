"use client"

import {
  createListCollection,
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectItemIndicator,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from "@/examples/ark/ui/select"

const northAmerica = [
  { label: "Eastern Standard Time", value: "est" },
  { label: "Central Standard Time", value: "cst" },
  { label: "Mountain Standard Time", value: "mst" },
  { label: "Pacific Standard Time", value: "pst" },
  { label: "Alaska Standard Time", value: "akst" },
  { label: "Hawaii Standard Time", value: "hst" },
]

const europeAfrica = [
  { label: "Greenwich Mean Time", value: "gmt" },
  { label: "Central European Time", value: "cet" },
  { label: "Eastern European Time", value: "eet" },
  { label: "Western European Summer Time", value: "west" },
  { label: "Central Africa Time", value: "cat" },
  { label: "East Africa Time", value: "eat" },
]

const asia = [
  { label: "Moscow Time", value: "msk" },
  { label: "India Standard Time", value: "ist" },
  { label: "China Standard Time", value: "cst_china" },
  { label: "Japan Standard Time", value: "jst" },
  { label: "Korea Standard Time", value: "kst" },
  { label: "Indonesia Central Standard Time", value: "ist_indonesia" },
]

const australiaPacific = [
  { label: "Australian Western Standard Time", value: "awst" },
  { label: "Australian Central Standard Time", value: "acst" },
  { label: "Australian Eastern Standard Time", value: "aest" },
  { label: "New Zealand Standard Time", value: "nzst" },
  { label: "Fiji Time", value: "fjt" },
]

const southAmerica = [
  { label: "Argentina Time", value: "art" },
  { label: "Bolivia Time", value: "bot" },
  { label: "Brasilia Time", value: "brt" },
  { label: "Chile Standard Time", value: "clt" },
]

const timezones = createListCollection({
  items: [
    ...northAmerica,
    ...europeAfrica,
    ...asia,
    ...australiaPacific,
    ...southAmerica,
  ],
})

export function SelectScrollable() {
  return (
    <Select collection={timezones}>
      <SelectTrigger className="w-full max-w-64">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectItemGroup>
          <SelectItemGroupLabel>North America</SelectItemGroupLabel>
          {northAmerica.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItemGroupLabel>Europe & Africa</SelectItemGroupLabel>
          {europeAfrica.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItemGroupLabel>Asia</SelectItemGroupLabel>
          {asia.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItemGroupLabel>Australia & Pacific</SelectItemGroupLabel>
          {australiaPacific.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
        <SelectItemGroup>
          <SelectItemGroupLabel>South America</SelectItemGroupLabel>
          {southAmerica.map((item) => (
            <SelectItem key={item.value} item={item}>
              <SelectItemText>{item.label}</SelectItemText>
              <SelectItemIndicator />
            </SelectItem>
          ))}
        </SelectItemGroup>
      </SelectContent>
    </Select>
  )
}
