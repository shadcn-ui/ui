import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"

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
      <SelectTrigger className="w-full max-w-64">
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
