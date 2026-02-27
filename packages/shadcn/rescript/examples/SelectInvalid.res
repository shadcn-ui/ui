type item = {
  label: string,
  value: Nullable.t<string>,
}

let items: array<item> = [
  {label: "Select a fruit", value: Nullable.null},
  {label: "Apple", value: Nullable.make("apple")},
  {label: "Banana", value: Nullable.make("banana")},
  {label: "Blueberry", value: Nullable.make("blueberry")},
]

@react.component
let make = () =>
  <Field dataInvalid={true} className="w-full max-w-48">
    <Field.Label> {"Fruit"->React.string} </Field.Label>
    <Select items>
      <Select.Trigger render={<button type_="button" ariaInvalid=#"true" />}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
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
    <Field.Error> {"Please select a fruit."->React.string} </Field.Error>
  </Field>
