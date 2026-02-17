type item = {
  label: string,
  value: string,
}

let months: array<item> = [
  {label: "MM", value: ""},
  {label: "01", value: "01"},
  {label: "02", value: "02"},
  {label: "03", value: "03"},
  {label: "04", value: "04"},
  {label: "05", value: "05"},
  {label: "06", value: "06"},
  {label: "07", value: "07"},
  {label: "08", value: "08"},
  {label: "09", value: "09"},
  {label: "10", value: "10"},
  {label: "11", value: "11"},
  {label: "12", value: "12"},
]

let years: array<item> = [
  {label: "YYYY", value: ""},
  {label: "2024", value: "2024"},
  {label: "2025", value: "2025"},
  {label: "2026", value: "2026"},
  {label: "2027", value: "2027"},
  {label: "2028", value: "2028"},
  {label: "2029", value: "2029"},
]

@react.component
let make = () =>
  <div className="w-full max-w-md">
    <form>
      <Field.Group>
        <Field.Set>
          <Field.Legend>{"Payment Method"->React.string}</Field.Legend>
          <Field.Description>{"All transactions are secure and encrypted"->React.string}</Field.Description>
          <Field.Group>
            <Field>
              <Field.Label htmlFor="checkout-7j9-card-name-43j">{"Name on Card"->React.string}</Field.Label>
              <Input
                id="checkout-7j9-card-name-43j"
                placeholder="Evil Rabbit"
                required={true}
              >
                {React.null}
              </Input>
            </Field>
            <Field>
              <Field.Label htmlFor="checkout-7j9-card-number-uw1">{"Card Number"->React.string}</Field.Label>
              <Input
                id="checkout-7j9-card-number-uw1"
                placeholder="1234 5678 9012 3456"
                required={true}
              >
                {React.null}
              </Input>
              <Field.Description>{"Enter your 16-digit card number"->React.string}</Field.Description>
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <Field.Label htmlFor="checkout-exp-month-ts6">{"Month"->React.string}</Field.Label>
                <Select items={months}>
                  <Select.Trigger id="checkout-exp-month-ts6">
                    <Select.Value>{"MM"->React.string}</Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {months->Array.map(item =>
                         <Select.Item key={item.value} value={item.value}>
                           {item.label->React.string}
                         </Select.Item>
                       )->React.array}
                    </Select.Group>
                  </Select.Content>
                </Select>
              </Field>
              <Field>
                <Field.Label htmlFor="checkout-7j9-exp-year-f59">{"Year"->React.string}</Field.Label>
                <Select items={years}>
                  <Select.Trigger id="checkout-7j9-exp-year-f59">
                    <Select.Value>{"YYYY"->React.string}</Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {years->Array.map(item =>
                         <Select.Item key={item.value} value={item.value}>
                           {item.label->React.string}
                         </Select.Item>
                       )->React.array}
                    </Select.Group>
                  </Select.Content>
                </Select>
              </Field>
              <Field>
                <Field.Label htmlFor="checkout-7j9-cvv">{"CVV"->React.string}</Field.Label>
                <Input id="checkout-7j9-cvv" placeholder="123" required={true}>
                  {React.null}
                </Input>
              </Field>
            </div>
          </Field.Group>
        </Field.Set>
        <Field.Separator />
        <Field.Set>
          <Field.Legend>{"Billing Address"->React.string}</Field.Legend>
          <Field.Description>
            {"The billing address associated with your payment method"->React.string}
          </Field.Description>
          <Field.Group>
            <Field orientation=BaseUi.Types.Orientation.Horizontal>
              <Checkbox
                id="checkout-7j9-same-as-shipping-wgm"
                defaultChecked={true}
              >
                {React.null}
              </Checkbox>
              <Field.Label
                htmlFor="checkout-7j9-same-as-shipping-wgm"
                className="font-normal"
              >
                {"Same as shipping address"->React.string}
              </Field.Label>
            </Field>
          </Field.Group>
        </Field.Set>
        <Field.Set>
          <Field.Group>
            <Field>
              <Field.Label htmlFor="checkout-7j9-optional-comments">{"Comments"->React.string}</Field.Label>
              <Textarea
                id="checkout-7j9-optional-comments"
                placeholder="Add any additional comments"
                className="resize-none"
              >
                {React.null}
              </Textarea>
            </Field>
          </Field.Group>
        </Field.Set>
        <Field orientation=BaseUi.Types.Orientation.Horizontal>
          <Button type_="submit">{"Submit"->React.string}</Button>
          <Button dataVariant=BaseUi.Types.Variant.Outline type_="button">
            {"Cancel"->React.string}
          </Button>
        </Field>
      </Field.Group>
    </form>
  </div>
