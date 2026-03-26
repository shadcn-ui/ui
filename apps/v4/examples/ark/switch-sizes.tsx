import {
  Switch,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchThumb,
} from "@/examples/ark/ui/switch"

export function SwitchSizes() {
  return (
    <div className="w-full max-w-[10rem] space-y-4">
      <Switch id="switch-size-sm">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Small</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
      <Switch id="switch-size-default">
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Default</SwitchLabel>
        <SwitchHiddenInput />
      </Switch>
    </div>
  )
}
