import { Label } from '@/ui/label';
import { Switch } from '@/ui/switch';

<template>
  <div class="flex items-center gap-3">
    <Switch id="airplane-mode" />
    <Label @for="airplane-mode">Airplane Mode</Label>
  </div>
</template>
