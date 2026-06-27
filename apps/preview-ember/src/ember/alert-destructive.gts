import { Alert, AlertDescription, AlertTitle } from '@/ember-ui/alert';

import AlertCircle from '~icons/ms/error';

<template>
  <Alert @variant="destructive" class="max-w-md">
    <AlertCircle />
    <AlertTitle>Payment failed</AlertTitle>
    <AlertDescription>
      Your payment could not be processed. Please check your payment method
      and try again.
    </AlertDescription>
  </Alert>
</template>
