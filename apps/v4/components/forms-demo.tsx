"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import { Input } from "@/registry/new-york-v4/ui/input"
import { Label } from "@/registry/new-york-v4/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/new-york-v4/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

const plans = [
  {
    id: "starter",
    name: "Starter Plan",
    description: "Perfect for small businesses.",
    price: "$10",
  },
  {
    id: "pro",
    name: "Pro Plan",
    description: "Advanced features with more storage.",
    price: "$20",
  },
] as const

const themes = {
  stone: {
    light: {
      "--primary": "oklch(0.216 0.006 56.043)", // --color-stone-900
      "--primary-foreground": "oklch(0.985 0.001 106.423)", // --color-stone-50
      "--accent": "oklch(0.97 0.001 106.424)", // --color-stone-100
      "--ring": "oklch(0.869 0.005 56.366)", // --color-stone-300
    },
    dark: {
      "--primary": "oklch(0.985 0.001 106.423)", // --color-stone-50
      "--primary-foreground": "oklch(0.216 0.006 56.043)", // --color-stone-900
      "--accent": "oklch(0.268 0.007 34.298)", // --color-stone-800
      "--accent-foreground": "oklch(0.985 0.001 106.423)", // --color-stone-50
      "--ring": "oklch(0.553 0.013 58.071)", // --color-stone-500
    },
  },
  blue: {
    light: {
      "--primary": "oklch(0.546 0.245 262.881)", // --color-blue-600
      "--primary-foreground": "oklch(0.985 0.001 106.423)", // --color-blue-50
      "--ring": "oklch(0.707 0.165 254.624)", // --color-blue-400
    },
    dark: {
      "--primary": "oklch(0.546 0.245 262.881)", // --color-blue-600
      "--primary-foreground": "oklch(0.985 0.001 106.423)", // --color-blue-50
      "--ring": "oklch(0.379 0.146 265.522)", // --color-blue-400
    },
  },
  amber: {
    light: {
      "--primary": "oklch(0.769 0.188 70.08)", // --color-blue-600
      "--primary-foreground": "oklch(0.985 0.001 106.423)", // --color-blue-50
      "--ring": "oklch(0.82 0.13 92.25)", // --color-blue-400
    },
    dark: {
      "--primary": "oklch(0.985 0.001 106.423)", // --color-stone-50
      "--primary-foreground": "oklch(0.216 0.006 56.043)", // --color-stone-900
      "--ring": "oklch(0.553 0.013 58.071)", // --color-stone-500
    },
  },
  teal: {
    light: {
      "--primary": "oklch(0.627 0.194 149.214)", // --color-blue-600
      "--primary-foreground": "oklch(0.985 0.001 106.423)", // --color-blue-50
      "--ring": "oklch(0.79 0.19 153.13)", // --color-blue-400
    },
    dark: {
      "--primary": "oklch(0.985 0.001 106.423)", // --color-stone-50
      "--primary-foreground": "oklch(0.216 0.006 56.043)", // --color-stone-900
      "--ring": "oklch(0.553 0.013 58.071)", // --color-stone-500
    },
  },
} as const

export function FormsDemo() {
  const { theme: mode = "light" } = useTheme()
  const [theme, setTheme] = React.useState<keyof typeof themes | undefined>(
    undefined
  )

  const themeStyles = React.useMemo(() => {
    if (!theme) return undefined
    return themes[theme][mode as keyof (typeof themes)[typeof theme]]
  }, [theme, mode])

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Card style={themeStyles as React.CSSProperties}>
        <CardHeader>
          <CardTitle className="text-lg">Upgrade your subscription</CardTitle>
          <CardDescription>
            You are currently on the free plan. Upgrade to the pro plan to get
            access to all features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Evil Rabbit" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="example@acme.com" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="grid grid-cols-[1fr_80px_60px] gap-3">
                <Input id="card-number" placeholder="1234 1234 1234 1234" />
                <Input id="card-number-expiry" placeholder="MM/YY" />
                <Input id="card-number-cvc" placeholder="CVC" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="color">Color</Label>
              <Select
                onValueChange={(value) =>
                  setTheme(value as keyof typeof themes)
                }
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(themes).map((theme) => (
                    <SelectItem key={theme} value={theme}>
                      <div
                        className="size-3.5 rounded-full"
                        style={{
                          backgroundColor:
                            themes[theme as keyof typeof themes]["light"][
                              "--primary"
                            ],
                        }}
                      />
                      {theme}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <fieldset className="flex flex-col gap-3">
              <legend className="text-sm font-medium">Plan</legend>
              <p className="text-muted-foreground text-sm">
                Select the plan that best fits your needs.
              </p>
              <RadioGroup
                defaultValue="starter"
                className="grid grid-cols-2 gap-3"
              >
                {plans.map((plan) => (
                  <Label
                    className="has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-ring/10 flex items-start gap-3 rounded-lg border p-3"
                    key={plan.id}
                  >
                    <RadioGroupItem
                      value={plan.id}
                      id={plan.name}
                      className="data-[state=checked]:border-primary"
                    />
                    <div className="grid gap-1 font-normal">
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-muted-foreground text-xs leading-snug">
                        {plan.description}
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </fieldset>
            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" placeholder="Enter notes" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="font-normal">
                  I agree to the terms and conditions
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="newsletter" defaultChecked />
                <Label htmlFor="newsletter" className="font-normal">
                  Allow us to send you emails
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Upgrade Plan</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
