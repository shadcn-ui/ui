"use client"

import { useState } from "react"

import { cn } from "@/registry/new-york/lib/utils"
import { Card, CardContent, CardHeader } from "@/registry/new-york/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"

import Login from "./login"
import SignUp from "./sign-up"

export function AuthForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [tab, setTab] = useState<"login" | "signup">("login")

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <Tabs
            defaultValue={tab}
            onValueChange={(value) => setTab(value as "login" | "signup")}
          >
            <TabsList className="w-full">
              <TabsTrigger value="login" className="flex-1">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex-1">
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {tab === "login" && <Login />}
          {tab === "signup" && <SignUp />}
        </CardContent>
      </Card>
    </div>
  )
}
