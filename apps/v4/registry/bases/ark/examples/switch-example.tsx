import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/registry/bases/ark/ui/switch"

export default function SwitchExample() {
  return (
    <ExampleWrapper>
      <SwitchBasic />
      <SwitchWithDescription />
      <SwitchDisabled />
    </ExampleWrapper>
  )
}

function SwitchBasic() {
  return (
    <Example title="Basic">
      <Switch id="switch-basic">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Airplane Mode</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
    </Example>
  )
}

function SwitchWithDescription() {
  return (
    <Example title="With Description">
      <Switch id="switch-focus-mode">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Share across devices</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
    </Example>
  )
}

function SwitchDisabled() {
  return (
    <Example title="Disabled">
      <div className="flex flex-col gap-12">
        <Switch id="switch-disabled-unchecked" disabled>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Disabled (Unchecked)</SwitchLabel>
          <SwitchHiddenInput />
        </Switch>
        <Switch id="switch-disabled-checked" defaultChecked disabled>
          <SwitchControl>
            <SwitchThumb />
          </SwitchControl>
          <SwitchLabel>Disabled (Checked)</SwitchLabel>
          <SwitchHiddenInput />
        </Switch>
      </div>
    </Example>
  )
}
