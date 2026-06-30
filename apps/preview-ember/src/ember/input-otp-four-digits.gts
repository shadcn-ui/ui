import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ember-ui/input-otp';

<template>
  <InputOTP @maxLength={{4}}>
    <InputOTPGroup>
      <InputOTPSlot @index={{0}} />
      <InputOTPSlot @index={{1}} />
      <InputOTPSlot @index={{2}} />
      <InputOTPSlot @index={{3}} />
    </InputOTPGroup>
  </InputOTP>
</template>
