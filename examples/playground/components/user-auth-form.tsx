"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsLoading(true)

    // Simulate a login request
    await new Promise((resolve) => setTimeout(resolve, 1000))

    router.push("/")

    return toast({
      title: "Check your email",
      description: "We sent you a login link. Be sure to check your spam too.",
    })
  }

  return (
    <form
      onSubmit={(event) => onSubmit(event)}
      className={cn("grid gap-6", className)}
      {...props}
    >
      <div className="flex flex-col space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            placeholder="Enter your email address..."
            disabled={isLoading}
            defaultValue="demo@example.com"
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          Continue with Email
        </Button>
      </div>
      <Separator />
      <Button type="submit" disabled={isLoading} variant="outline">
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
    </form>
  )
}
