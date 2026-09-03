import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/styles/ark-nova/ui/switch"

export function SwitchInvalid() {
  return (
    <Switch id="switch-terms" invalid className="max-w-sm">
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Accept terms and conditions</SwitchLabel>
      <SwitchHiddenInput />
    </Switch>
  )
}
