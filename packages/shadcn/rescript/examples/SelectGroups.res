type item = {
  label: string,
  value: Nullable.t<string>,
}

let fruits: array<item> = [
  {label: "Apple", value: Nullable.make("apple")},
  {label: "Banana", value: Nullable.make("banana")},
  {label: "Blueberry", value: Nullable.make("blueberry")},
]

let vegetables: array<item> = [
  {label: "Carrot", value: Nullable.make("carrot")},
  {label: "Broccoli", value: Nullable.make("broccoli")},
  {label: "Spinach", value: Nullable.make("spinach")},
]

let allItems: array<item> = [
  {label: "Select a fruit", value: Nullable.null},
  {label: "Apple", value: Nullable.make("apple")},
  {label: "Banana", value: Nullable.make("banana")},
  {label: "Blueberry", value: Nullable.make("blueberry")},
  {label: "Carrot", value: Nullable.make("carrot")},
  {label: "Broccoli", value: Nullable.make("broccoli")},
  {label: "Spinach", value: Nullable.make("spinach")},
]

@react.component
let make = () =>
  <Select items={allItems}>
    <Select.Trigger className="w-full max-w-48">
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label> {"Fruits"->React.string} </Select.Label>
        {fruits
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
      <Select.Separator />
      <Select.Group>
        <Select.Label> {"Vegetables"->React.string} </Select.Label>
        {vegetables
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
    </Select.Content>
  </Select>
