import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export function SwitchDisabled() {
  return (
    <Switch id="switch-disabled-unchecked" disabled>
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Disabled</SwitchLabel>
      <SwitchHiddenInput />
    </Switch>
  )
}
