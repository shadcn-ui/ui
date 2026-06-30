<script setup lang="ts">
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
</script>

<template>
  <Card class="w-full max-w-sm" dir="rtl">
    <CardHeader>
      <CardTitle>تسجيل الدخول إلى حسابك</CardTitle>
      <CardDescription>
        أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
      </CardDescription>
      <CardAction>
        <Button variant="link">إنشاء حساب</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label for="email-rtl">البريد الإلكتروني</Label>
            <Input
              id="email-rtl"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password-rtl">كلمة المرور</Label>
              <a
                href="#"
                class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                نسيت كلمة المرور؟
              </a>
            </div>
            <Input id="password-rtl" type="password" required />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex-col gap-2">
      <Button type="submit" class="w-full">
        تسجيل الدخول
      </Button>
      <Button variant="outline" class="w-full">
        تسجيل الدخول باستخدام Google
      </Button>
    </CardFooter>
  </Card>
</template>
