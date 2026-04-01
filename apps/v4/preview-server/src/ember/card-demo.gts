import { Button } from '@/ember-ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ember-ui/card';
import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';

<template>
  <Card @class="w-full max-w-sm">
    <CardHeader>
      <CardTitle>Login to your account</CardTitle>
      <CardDescription>
        Enter your email below to login to your account
      </CardDescription>
      <CardAction>
        <Button @variant="link">Sign Up</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label @for="email">Email</Label>
            <Input
              id="email"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label @for="password">Password</Label>
              <a
                class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                href="#"
              >
                Forgot your password?
              </a>
            </div>
            <Input id="password" required type="password" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter @class="flex-col gap-2">
      <Button @class="w-full" type="submit">
        Login
      </Button>
      <Button @class="w-full" @variant="outline">
        Login with Google
      </Button>
    </CardFooter>
  </Card>
</template>
