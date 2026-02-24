"use client"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/base/ui/card"

export function EnvironmentVariables() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environment Variables</CardTitle>
        <CardDescription>Production · 8 variables</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {[
          { key: "DATABASE_URL", masked: true },
          { key: "NEXT_PUBLIC_API", masked: false },
          { key: "STRIPE_SECRET", masked: true },
        ].map((env) => (
          <div
            key={env.key}
            className="ring-border flex items-center gap-2 rounded-md px-2.5 py-2 font-mono text-xs ring"
          >
            <span className="font-medium">{env.key}</span>
            <span className="text-muted-foreground ml-auto">
              {env.masked ? "••••••••" : "https://api.example.com"}
            </span>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline">Edit</Button>
        <Button className="ml-auto">Deploy</Button>
      </CardFooter>
    </Card>
  )
}
