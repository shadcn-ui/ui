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
  <Card @class="w-full max-w-sm" dir="rtl">
    <CardHeader>
      <CardTitle>تسجيل الدخول إلى حسابك</CardTitle>
      <CardDescription>
        أدخل بريدك الإلكتروني أدناه لتسجيل الدخول إلى حسابك
      </CardDescription>
      <CardAction>
        <Button @variant="link">إنشاء حساب</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <form>
        <div class="flex flex-col gap-6">
          <div class="grid gap-2">
            <Label @for="email-rtl">البريد الإلكتروني</Label>
            <Input
              id="email-rtl"
              placeholder="m@example.com"
              required
              type="email"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label @for="password-rtl">كلمة المرور</Label>
              <a
                class="ms-auto inline-block text-sm underline-offset-4 hover:underline"
                href="#"
              >
                نسيت كلمة المرور؟
              </a>
            </div>
            <Input id="password-rtl" required type="password" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter @class="flex-col gap-2">
      <Button @class="w-full" type="submit">
        تسجيل الدخول
      </Button>
      <Button @class="w-full" @variant="outline">
        تسجيل الدخول باستخدام Google
      </Button>
    </CardFooter>
  </Card>
</template>
