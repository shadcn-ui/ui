import { Checkbox } from '@/ember-ui/checkbox';
import { Label } from '@/ember-ui/label';

<template>
  <div class="flex flex-col gap-6">
    <div class="flex items-center gap-3">
      <Checkbox id="terms" />
      <Label @for="terms">Accept terms and conditions</Label>
    </div>
    <div class="flex items-start gap-3">
      <Checkbox @checked={{true}} id="terms-2" />
      <div class="grid gap-2">
        <Label @for="terms-2">Accept terms and conditions</Label>
        <p class="text-muted-foreground text-sm">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>
    <div class="flex items-start gap-3">
      <Checkbox @disabled={{true}} id="toggle" />
      <Label @for="toggle">Enable notifications</Label>
    </div>
    <Label
      class="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950"
    >
      <Checkbox
        @checked={{true}}
        @class="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        id="toggle-2"
      />
      <div class="grid gap-1.5 font-normal">
        <p class="text-sm leading-none font-medium">
          Enable notifications
        </p>
        <p class="text-muted-foreground text-sm">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </Label>
  </div>
</template>
