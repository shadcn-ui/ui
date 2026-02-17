let frameworks = ["Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro"]

@react.component
let make = () =>
  <Combobox items=frameworks>
    <Combobox.Input placeholder="Select a framework">{React.null}</Combobox.Input>
    <Combobox.Content>
      <Combobox.Empty>{"No items found."->React.string}</Combobox.Empty>
      <Combobox.List>
        {frameworks
        ->Belt.Array.map(item =>
          <Combobox.Item key=item value=item>
            {item->React.string}
          </Combobox.Item>
        )
        ->React.array}
      </Combobox.List>
    </Combobox.Content>
  </Combobox>
