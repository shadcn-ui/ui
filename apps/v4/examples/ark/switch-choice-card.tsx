import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export function SwitchChoiceCard() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Switch id="switch-share">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Share across devices</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
      <Switch id="switch-notifications" defaultChecked>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Enable notifications</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
    </div>
  )
}
