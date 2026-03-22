import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-lyra/components/example"
import {
  RadioGroup,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
} from "@/registry/ark-lyra/ui/radio-group"
import {
  FieldContent,
  FieldDescription,
} from "@/registry/ark-lyra/ui/field"

export default function RadioGroupExample() {
  return (
    <ExampleWrapper>
      <RadioGroupBasic />
      <RadioGroupWithDescriptions />
      <RadioGroupWithFieldSet />
      <RadioGroupGrid />
      <RadioGroupDisabled />
      <RadioGroupInvalid />
    </ExampleWrapper>
  )
}

function RadioGroupBasic() {
  return (
    <Example title="Basic">
      <RadioGroup defaultValue="comfortable">
        <RadioGroupItem value="default">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Default
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="comfortable">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Comfortable
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="compact">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Compact
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithDescriptions() {
  return (
    <Example title="With Descriptions">
      <RadioGroup defaultValue="plus">
        <RadioGroupItem value="plus">
          <RadioGroupItemControl />
          <FieldContent>
            <RadioGroupItemText>Plus</RadioGroupItemText>
            <FieldDescription>
              For individuals and small teams
            </FieldDescription>
          </FieldContent>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="pro">
          <RadioGroupItemControl />
          <FieldContent>
            <RadioGroupItemText>Pro</RadioGroupItemText>
            <FieldDescription>For growing businesses</FieldDescription>
          </FieldContent>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="enterprise">
          <RadioGroupItemControl />
          <FieldContent>
            <RadioGroupItemText>Enterprise</RadioGroupItemText>
            <FieldDescription>
              For large teams and enterprises
            </FieldDescription>
          </FieldContent>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupWithFieldSet() {
  return (
    <Example title="With Label">
      <RadioGroup defaultValue="medium">
        <RadioGroupLabel>Battery Level</RadioGroupLabel>
        <RadioGroupItem value="high">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            High
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="medium">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Medium
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="low">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Low
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupGrid() {
  return (
    <Example title="Grid Layout">
      <RadioGroup defaultValue="medium" className="grid grid-cols-2 gap-2">
        <RadioGroupItem value="small">
          <RadioGroupItemControl />
          <RadioGroupItemText>Small</RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="medium">
          <RadioGroupItemControl />
          <RadioGroupItemText>Medium</RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="large">
          <RadioGroupItemControl />
          <RadioGroupItemText>Large</RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="xlarge">
          <RadioGroupItemControl />
          <RadioGroupItemText>X-Large</RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupDisabled() {
  return (
    <Example title="Disabled">
      <RadioGroup defaultValue="option2" disabled>
        <RadioGroupItem value="option1">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Option 1
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="option2">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Option 2
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="option3">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Option 3
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}

function RadioGroupInvalid() {
  return (
    <Example title="Invalid">
      <RadioGroup defaultValue="email">
        <RadioGroupLabel>Notification Preferences</RadioGroupLabel>
        <RadioGroupItem value="email">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Email only
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="sms">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            SMS only
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
        <RadioGroupItem value="both">
          <RadioGroupItemControl />
          <RadioGroupItemText className="font-normal">
            Both Email & SMS
          </RadioGroupItemText>
          <RadioGroupItemHiddenInput />
        </RadioGroupItem>
      </RadioGroup>
    </Example>
  )
}
