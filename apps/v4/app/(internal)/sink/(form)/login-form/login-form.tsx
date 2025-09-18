"use client"

import { useActionState, useEffect, useState } from "react"
import Form from "next/form"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/registry/new-york-v4/ui/field"
import { Input } from "@/registry/new-york-v4/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/registry/new-york-v4/ui/input-group"

import { loginAction } from "./actions"

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
})

export type FormState = {
  values: z.infer<typeof loginSchema>
  errors: null | Partial<Record<keyof z.infer<typeof loginSchema>, string[]>>
  success: boolean
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [formState, formAction, pending] = useActionState<FormState, FormData>(
    loginAction,
    {
      values: {
        email: "name@example.com",
        password: "qGuFNBFeb_jM8g0",
      },
      errors: null,
      success: false,
    }
  )

  useEffect(() => {
    if (formState.success) {
      toast.success("Login successful")
    }
  }, [formState.success])

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to sign in.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form action={formAction}>
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.email?.length}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                defaultValue={formState.values.email}
                required
                disabled={pending}
                aria-invalid={!!formState.errors?.email?.length}
              />
              <FieldDescription>
                Use <span className="font-bold">admin@example.com</span> for a
                valid email address.
              </FieldDescription>
              {formState.errors?.email && (
                <FieldError className="text-destructive">
                  {formState.errors.email[0]}
                </FieldError>
              )}
            </Field>
            <Field data-invalid={!!formState.errors?.password?.length}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  defaultValue={formState.values.password}
                  required
                  minLength={6}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.password?.length}
                />
                <InputGroupAddon align="end">
                  <InputGroupButton
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={pending}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              {formState.errors?.password && (
                <FieldError className="text-destructive">
                  {formState.errors.password[0]}
                </FieldError>
              )}
            </Field>
            <Button type="submit" disabled={pending}>
              {pending && <Loader2 className="animate-spin" />}
              {pending ? "Signing in..." : "Sign in"}
            </Button>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  )
}
