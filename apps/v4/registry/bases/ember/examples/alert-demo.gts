import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';

import AlertCircle from '~icons/lucide/alert-circle';
import CheckCircle2 from '~icons/lucide/check-circle-2';
import Popcorn from '~icons/lucide/popcorn';

<template>
  <div class="grid w-full max-w-xl items-start gap-4">
    <Alert>
      <CheckCircle2 />
      <AlertTitle>Success! Your changes have been saved</AlertTitle>
      <AlertDescription>
        This is an alert with icon, title and description.
      </AlertDescription>
    </Alert>
    <Alert>
      <Popcorn />
      <AlertTitle>
        This Alert has a title and an icon. No description.
      </AlertTitle>
    </Alert>
    <Alert @variant="destructive">
      <AlertCircle />
      <AlertTitle>Unable to process your payment.</AlertTitle>
      <AlertDescription>
        <p>Please verify your billing information and try again.</p>
        <ul class="list-inside list-disc text-sm">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </AlertDescription>
    </Alert>
  </div>
</template>
