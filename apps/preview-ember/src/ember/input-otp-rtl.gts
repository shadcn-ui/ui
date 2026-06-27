import {
  Field,
  FieldLabel,
} from '@/ember-ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ember-ui/input-otp';

<template>
  <Field class="mx-auto max-w-xs">
    <FieldLabel for="input-otp-rtl">رمز التحقق</FieldLabel>
    <InputOTP
      @maxLength={{6}}
      @value="123456"
      @dir="rtl"
      id="input-otp-rtl"
    >
      <InputOTPGroup>
        <InputOTPSlot @index={{0}} />
        <InputOTPSlot @index={{1}} />
        <InputOTPSlot @index={{2}} />
        <InputOTPSlot @index={{3}} />
        <InputOTPSlot @index={{4}} />
        <InputOTPSlot @index={{5}} />
      </InputOTPGroup>
    </InputOTP>
  </Field>
</template>
