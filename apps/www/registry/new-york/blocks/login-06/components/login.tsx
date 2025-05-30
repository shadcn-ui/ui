import { Button } from "@/registry/new-york/ui/button"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"

import { AppleIcon, GithubIcon, GoogleIcon, MetaIcon } from "./icons"

export default function Login() {
  return (
    <form>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="email">Email</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your email?
            </a>
          </div>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <div className="flex flex-col gap-3">
          <Button variant="outline" className="w-full">
            <GoogleIcon />
            Continue with Google
          </Button>
          <Button variant="outline" className="w-full">
            <AppleIcon />
            Continue with Apple
          </Button>
          <Button variant="outline" className="w-full">
            <MetaIcon />
            Continue with Meta
          </Button>
          <Button variant="outline" className="w-full">
            <GithubIcon />
            Continue with Github
          </Button>
        </div>
      </div>
    </form>
  )
}
