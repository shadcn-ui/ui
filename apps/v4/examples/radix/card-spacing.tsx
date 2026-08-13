"use client"

import * as React from "react"

import { Button } from "@/styles/radix-nova/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/radix-nova/ui/card"
import { Input } from "@/styles/radix-nova/ui/input"
import { Label } from "@/styles/radix-nova/ui/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/radix-nova/ui/toggle-group"

const spacingOptions = [
  {
    className: "[--card-spacing:--spacing(4)]",
    label: "16px",
    value: "4",
  },
  {
    className: "[--card-spacing:--spacing(5)]",
    label: "20px",
    value: "5",
  },
  {
    className: "[--card-spacing:--spacing(6)]",
    label: "24px",
    value: "6",
  },
  {
    className: "[--card-spacing:--spacing(8)]",
    label: "32px",
    value: "8",
  },
]

export function CardSpacing() {
  const [spacing, setSpacing] = React.useState("4")
  const selectedSpacing = spacingOptions.find(
    (option) => option.value === spacing
  )

  return (
    <div className="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        type="single"
        value={spacing}
        onValueChange={(value) => {
          if (value) {
            setSpacing(value)
          }
        }}
        variant="outline"
        size="sm"
        className="justify-center"
      >
        {spacingOptions.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Card className={selectedSpacing?.className}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-spacing">Email</Label>
                <Input
                  id="email-spacing"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-spacing">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password-spacing" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
