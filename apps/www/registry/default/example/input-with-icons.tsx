import { Input } from "@/registry/default/ui/input"
import { Label } from "@/registry/default/ui/label"

export default function InputWithIcons() {
  return (
    <div className="grid w-full max-w-sm items-center gap-3">
      <Label>Email with icons in the start position</Label>
      <Input
        type="email"
        icon="Mail"
        iconPosition="start"
        placeholder="Email"
        iconMaxShowWidth="600px"
      />

      <Label>Email with icons in the end position</Label>
      <Input type="email" icon="Mail" iconPosition="end" placeholder="Email" />

      <Label>Password with default icon</Label>
      <Input
        type="password"
        showIconPwd={true}
        iconPosition="start"
        placeholder="Password"
      />

      <Label>Password with default icon and position</Label>
      <Input
        type="password"
        showIconPwd={true}
        iconPosition="end"
        placeholder="Password"
        iconMaxShowWidth="600px"
      />
    </div>
  )
}
