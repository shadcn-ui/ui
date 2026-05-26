import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export function SwitchDescription() {
  return (
    <Switch id="switch-focus-mode" className="max-w-sm">
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Share across devices</SwitchLabel>
      <SwitchHiddenInput />
    </Switch>
  )
}
