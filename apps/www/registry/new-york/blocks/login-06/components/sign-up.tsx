import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

export default function SignUp() {
  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="email">Email</Label>
          </div>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <Button variant="outline">Confirm</Button>
          </div>
          <p className="text-muted-foreground text-sm">
            We will use this email to verify your account.
          </p>
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="confirm-password">Confirm Password</Label>
          </div>
          <Input id="confirm-password" type="password" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="full-name">Full Name</Label>
          </div>
          <Input id="full-name" type="text" required />
        </div>
        <Button type="submit" className="w-full">
          Sign up
        </Button>
      </div>
    </form>
  )
}
