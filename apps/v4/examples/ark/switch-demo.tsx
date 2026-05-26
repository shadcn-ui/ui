import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export function SwitchDemo() {
  return (
    <Switch id="airplane-mode">
      <SwitchControl>
        <SwitchThumb />
      </SwitchControl>
      <SwitchLabel>Airplane Mode</SwitchLabel>
      <SwitchHiddenInput />
    </Switch>
  )
}
