@@directive("'use client'")

type currency = {
  label: string,
  value: string,
}

let currencies: array<currency> = [
  {label: "US Dollar", value: "$"},
  {label: "Euro", value: "€"},
  {label: "British Pound", value: "£"},
]

@react.component
let make = () => {
  let (currency, setCurrency) = React.useState(() => "$")
  let items = currencies->Array.map(item => item.value)

  <ButtonGroup>
    <ButtonGroup>
      <Select items value=currency onValueChange={(value, _) => setCurrency(_ => value)}>
        <Select.Trigger className="font-mono"> {currency->React.string} </Select.Trigger>
        <Select.Content dataAlignTrigger={false} align=BaseUi.Types.Align.Start>
          <Select.Group>
            {currencies
            ->Array.map(item =>
              <Select.Item key={item.value} value={item.value}>
                {item.value->React.string}
                {" "->React.string}
                <span className="text-muted-foreground"> {item.label->React.string} </span>
              </Select.Item>
            )
            ->React.array}
          </Select.Group>
        </Select.Content>
      </Select>
      <Input placeholder="10.00" pattern="[0-9]*" />
    </ButtonGroup>
    <ButtonGroup>
      <Button ariaLabel="Send" size=Button.Size.Icon variant=Button.Variant.Outline>
        <Icons.ArrowRight />
      </Button>
    </ButtonGroup>
  </ButtonGroup>
}
