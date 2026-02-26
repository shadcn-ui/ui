type item = {
  label: string,
  value: Nullable.t<string>,
}

let items: array<item> = [
  {label: "Select a fruit", value: Nullable.null},
  {label: "Apple", value: Nullable.make("apple")},
  {label: "Banana", value: Nullable.make("banana")},
  {label: "Blueberry", value: Nullable.make("blueberry")},
  {label: "Grapes", value: Nullable.make("grapes")},
  {label: "Pineapple", value: Nullable.make("pineapple")},
]

@react.component
let make = () =>
  <Select items>
    <Select.Trigger className="w-full max-w-48">
      <Select.Value> {React.null} </Select.Value>
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        <Select.Label> {"Fruits"->React.string} </Select.Label>
        {items
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
    </Select.Content>
  </Select>
