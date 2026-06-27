<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/ui/toggle-group'

const spacingOptions = [
  { className: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
  { className: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
  { className: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
  { className: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
]

const spacing = ref('4')

const selectedSpacing = computed(() =>
  spacingOptions.find((option) => option.value === spacing.value)
)
</script>

<template>
  <div class="mx-auto grid w-full max-w-sm gap-4">
    <ToggleGroup
      type="single"
      :model-value="spacing"
      @update:model-value="(value: unknown) => { if (value) spacing = value as string }"
      variant="outline"
      size="sm"
      class="justify-center"
    >
      <ToggleGroupItem
        v-for="option in spacingOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </ToggleGroupItem>
    </ToggleGroup>
    <Card :class="selectedSpacing?.className">
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
          <div class="flex flex-col gap-6">
            <div class="grid gap-2">
              <Label for="email-spacing">Email</Label>
              <Input
                id="email-spacing"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div class="grid gap-2">
              <div class="flex items-center">
                <Label for="password-spacing">Password</Label>
                <a
                  href="#"
                  class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input id="password-spacing" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Button type="submit" class="w-full">
          Login
        </Button>
        <Button variant="outline" class="w-full">
          Login with Google
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
