import { Alert, AlertDescription, AlertTitle } from '@/ember-ui/alert';

import AlertTriangle from '~icons/ms/warning';

<template>
  <Alert class="max-w-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
    <AlertTriangle />
    <AlertTitle>Your subscription will expire in 3 days.</AlertTitle>
    <AlertDescription>
      Renew now to avoid service interruption or upgrade to a paid plan to
      continue using the service.
    </AlertDescription>
  </Alert>
</template>
