import { Alert, AlertDescription, AlertTitle } from '@/ui/alert';

import CircleCheckBig from '~icons/material-symbols/check-circle-outline-rounded';
import Info from '~icons/material-symbols/info-outline-rounded';
import TriangleAlert from '~icons/material-symbols/warning-outline-rounded';

<template>
  <div class="flex w-full max-w-md flex-col gap-4">
    <Alert @variant="success">
      <CircleCheckBig />
      <AlertTitle>Payment received</AlertTitle>
      <AlertDescription>Your invoice has been paid in full.</AlertDescription>
    </Alert>
    <Alert @variant="info">
      <Info />
      <AlertTitle>Scheduled maintenance</AlertTitle>
      <AlertDescription>The service will be unavailable on Sunday from 02:00–04:00 UTC.</AlertDescription>
    </Alert>
    <Alert @variant="warning">
      <TriangleAlert />
      <AlertTitle>Your subscription expires soon</AlertTitle>
      <AlertDescription>Renew within 3 days to avoid any interruption to your service.</AlertDescription>
    </Alert>
  </div>
</template>
