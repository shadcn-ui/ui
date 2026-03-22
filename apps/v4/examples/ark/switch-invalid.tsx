import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

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
