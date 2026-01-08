import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/registry/base-nova/ui/select"

const northAmerica = [
  { label: "Eastern Standard Time (EST)", value: "est" },
  { label: "Central Standard Time (CST)", value: "cst" },
  { label: "Mountain Standard Time (MST)", value: "mst" },
  { label: "Pacific Standard Time (PST)", value: "pst" },
  { label: "Alaska Standard Time (AKST)", value: "akst" },
  { label: "Hawaii Standard Time (HST)", value: "hst" },
]

const europeAfrica = [
  { label: "Greenwich Mean Time (GMT)", value: "gmt" },
  { label: "Central European Time (CET)", value: "cet" },
  { label: "Eastern European Time (EET)", value: "eet" },
  { label: "Western European Summer Time (WEST)", value: "west" },
  { label: "Central Africa Time (CAT)", value: "cat" },
  { label: "East Africa Time (EAT)", value: "eat" },
]

const asia = [
  { label: "Moscow Time (MSK)", value: "msk" },
  { label: "India Standard Time (IST)", value: "ist" },
  { label: "China Standard Time (CST)", value: "cst_china" },
  { label: "Japan Standard Time (JST)", value: "jst" },
  { label: "Korea Standard Time (KST)", value: "kst" },
  { label: "Indonesia Central Standard Time (WITA)", value: "ist_indonesia" },
]

const australiaPacific = [
  { label: "Australian Western Standard Time (AWST)", value: "awst" },
  { label: "Australian Central Standard Time (ACST)", value: "acst" },
  { label: "Australian Eastern Standard Time (AEST)", value: "aest" },
  { label: "New Zealand Standard Time (NZST)", value: "nzst" },
  { label: "Fiji Time (FJT)", value: "fjt" },
]

const southAmerica = [
  { label: "Argentina Time (ART)", value: "art" },
  { label: "Bolivia Time (BOT)", value: "bot" },
  { label: "Brasilia Time (BRT)", value: "brt" },
  { label: "Chile Standard Time (CLT)", value: "clt" },
]

const items = [
  { label: "Select a timezone", value: null },
  ...northAmerica,
  ...europeAfrica,
  ...asia,
  ...australiaPacific,
  ...southAmerica,
]

export function SelectScrollable() {
  return (
    <Select items={items}>
      <SelectTrigger className="w-[280px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>North America</SelectLabel>
          {northAmerica.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Europe & Africa</SelectLabel>
          {europeAfrica.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Asia</SelectLabel>
          {asia.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Australia & Pacific</SelectLabel>
          {australiaPacific.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>South America</SelectLabel>
          {southAmerica.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
