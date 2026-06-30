import { Alert, AlertDescription, AlertTitle } from '@/ember-ui/alert';

import CheckCircle2 from '~icons/ms/check_circle';

<template>
  <Alert class="max-w-md">
    <CheckCircle2 />
    <AlertTitle>Account updated successfully</AlertTitle>
    <AlertDescription>
      Your profile information has been saved. Changes will be reflected
      immediately.
    </AlertDescription>
  </Alert>
</template>
