type item = {
  label: string,
  value: Nullable.t<string>,
  disabled: bool,
}

@react.component
let make = () => {
  let items: array<item> = [
    {label: "Select a fruit", value: Nullable.null, disabled: false},
    {label: "Apple", value: Nullable.make("apple"), disabled: false},
    {label: "Banana", value: Nullable.make("banana"), disabled: false},
    {label: "Blueberry", value: Nullable.make("blueberry"), disabled: false},
    {label: "Grapes", value: Nullable.make("grapes"), disabled: true},
    {label: "Pineapple", value: Nullable.make("pineapple"), disabled: false},
  ]

  <Select items disabled={true}>
    <Select.Trigger className="w-full max-w-48">
      <Select.Value />
    </Select.Trigger>
    <Select.Content>
      <Select.Group>
        {items
        ->Array.map(item =>
          <Select.Item key={item.label} value={item.value} disabled={item.disabled}>
            {item.label->React.string}
          </Select.Item>
        )
        ->React.array}
      </Select.Group>
    </Select.Content>
  </Select>
}
