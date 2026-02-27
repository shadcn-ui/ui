type item = {
  label: string,
  value: Nullable.t<string>,
}

let northAmerica: array<item> = [
  {label: "Eastern Standard Time", value: Nullable.make("est")},
  {label: "Central Standard Time", value: Nullable.make("cst")},
  {label: "Mountain Standard Time", value: Nullable.make("mst")},
  {label: "Pacific Standard Time", value: Nullable.make("pst")},
  {label: "Alaska Standard Time", value: Nullable.make("akst")},
  {label: "Hawaii Standard Time", value: Nullable.make("hst")},
]

let europeAfrica: array<item> = [
  {label: "Greenwich Mean Time", value: Nullable.make("gmt")},
  {label: "Central European Time", value: Nullable.make("cet")},
  {label: "Eastern European Time", value: Nullable.make("eet")},
  {label: "Western European Summer Time", value: Nullable.make("west")},
  {label: "Central Africa Time", value: Nullable.make("cat")},
  {label: "East Africa Time", value: Nullable.make("eat")},
]

let asia: array<item> = [
  {label: "Moscow Time", value: Nullable.make("msk")},
  {label: "India Standard Time", value: Nullable.make("ist")},
  {label: "China Standard Time", value: Nullable.make("cst_china")},
  {label: "Japan Standard Time", value: Nullable.make("jst")},
  {label: "Korea Standard Time", value: Nullable.make("kst")},
  {label: "Indonesia Central Standard Time", value: Nullable.make("ist_indonesia")},
]

let australiaPacific: array<item> = [
  {label: "Australian Western Standard Time", value: Nullable.make("awst")},
  {label: "Australian Central Standard Time", value: Nullable.make("acst")},
  {label: "Australian Eastern Standard Time", value: Nullable.make("aest")},
  {label: "New Zealand Standard Time", value: Nullable.make("nzst")},
  {label: "Fiji Time", value: Nullable.make("fjt")},
]

let southAmerica: array<item> = [
  {label: "Argentina Time", value: Nullable.make("art")},
  {label: "Bolivia Time", value: Nullable.make("bot")},
  {label: "Brasilia Time", value: Nullable.make("brt")},
  {label: "Chile Standard Time", value: Nullable.make("clt")},
]

let items: array<item> = [
  {label: "Select a timezone", value: Nullable.null},
  {label: "Eastern Standard Time", value: Nullable.make("est")},
  {label: "Central Standard Time", value: Nullable.make("cst")},
  {label: "Mountain Standard Time", value: Nullable.make("mst")},
  {label: "Pacific Standard Time", value: Nullable.make("pst")},
  {label: "Alaska Standard Time", value: Nullable.make("akst")},
  {label: "Hawaii Standard Time", value: Nullable.make("hst")},
  {label: "Greenwich Mean Time", value: Nullable.make("gmt")},
  {label: "Central European Time", value: Nullable.make("cet")},
  {label: "Eastern European Time", value: Nullable.make("eet")},
  {label: "Western European Summer Time", value: Nullable.make("west")},
  {label: "Central Africa Time", value: Nullable.make("cat")},
  {label: "East Africa Time", value: Nullable.make("eat")},
  {label: "Moscow Time", value: Nullable.make("msk")},
  {label: "India Standard Time", value: Nullable.make("ist")},
  {label: "China Standard Time", value: Nullable.make("cst_china")},
  {label: "Japan Standard Time", value: Nullable.make("jst")},
  {label: "Korea Standard Time", value: Nullable.make("kst")},
  {label: "Indonesia Central Standard Time", value: Nullable.make("ist_indonesia")},
  {label: "Australian Western Standard Time", value: Nullable.make("awst")},
  {label: "Australian Central Standard Time", value: Nullable.make("acst")},
  {label: "Australian Eastern Standard Time", value: Nullable.make("aest")},
  {label: "New Zealand Standard Time", value: Nullable.make("nzst")},
  {label: "Fiji Time", value: Nullable.make("fjt")},
  {label: "Argentina Time", value: Nullable.make("art")},
  {label: "Bolivia Time", value: Nullable.make("bot")},
  {label: "Brasilia Time", value: Nullable.make("brt")},
  {label: "Chile Standard Time", value: Nullable.make("clt")},
]

@react.component
let make = () =>
  <Select items>
    <Select.Trigger className="w-full max-w-64">
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label> {"North America"->React.string} </Select.Label>
        {northAmerica
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
      <Select.Group>
        <Select.Label> {"Europe & Africa"->React.string} </Select.Label>
        {europeAfrica
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
      <Select.Group>
        <Select.Label> {"Asia"->React.string} </Select.Label>
        {asia
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
      <Select.Group>
        <Select.Label> {"Australia & Pacific"->React.string} </Select.Label>
        {australiaPacific
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
      <Select.Group>
        <Select.Label> {"South America"->React.string} </Select.Label>
        {southAmerica
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
    </Select.Content>
  </Select>
