@@directive("'use client'")

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
let make = () => {
  let (alignItemWithTrigger, setAlignItemWithTrigger) = React.useState(() => true)
  let defaultItem = items->Array.get(2)->Option.getOr({label: "Banana", value: Nullable.make("banana")})

  <Field.Group className="w-full max-w-xs">
    <Field orientation=BaseUi.Types.Orientation.Horizontal>
      <Field.Content>
        <Field.Label htmlFor="align-item"> {"Align Item"->React.string} </Field.Label>
        <Field.Description>
          {"Toggle to align the item with the trigger."->React.string}
        </Field.Description>
      </Field.Content>
      <Switch
        id="align-item"
        checked={alignItemWithTrigger}
        onCheckedChange={(checked, _) => setAlignItemWithTrigger(_ => checked)}
      />
    </Field>
    <Field>
      <Select items defaultValue={defaultItem}>
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Content dataAlignTrigger={alignItemWithTrigger}>
          <Select.Group>
            {items
            ->Array.map(item =>
              <Select.Item key={item.label} value={item}>
                {item.label->React.string}
              </Select.Item>
            )
            ->React.array}
          </Select.Group>
        </Select.Content>
      </Select>
    </Field>
  </Field.Group>
}
