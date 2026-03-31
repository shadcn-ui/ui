<script setup lang="ts">
import { Button } from "@/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
import { Example } from "@/components"
</script>

<template>
  <Example title="Login">
    <Card class="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel html-for="email">
                Email
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </Field>
            <Field>
              <div class="flex items-center">
                <FieldLabel html-for="password">
                  Password
                </FieldLabel>
                <a
                  href="#"
                  class="ml-auto inline-block underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password" type="password" required />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Button type="submit" class="w-full">
          Login
        </Button>
        <Button variant="outline" class="w-full">
          Login with Google
        </Button>
        <div class="style-nova:mt-2 mt-4 text-center">
          Don't have an account?
          <a href="#" class="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </CardFooter>
    </Card>
  </Example>
</template>
