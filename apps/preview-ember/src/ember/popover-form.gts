import { Button } from '@/ember-ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';

<template>
  <Popover>
    <PopoverTrigger>
      <Button @variant="outline">Open Popover</Button>
    </PopoverTrigger>
    <PopoverContent @align="start" @class="w-64">
      <div class="flex flex-col gap-1 mb-4">
        <p class="text-sm font-medium">Dimensions</p>
        <p class="text-muted-foreground text-sm">
          Set the dimensions for the layer.
        </p>
      </div>
      <FieldGroup @class="gap-4">
        <Field @orientation="horizontal">
          <FieldLabel @class="w-1/2" @for="width">Width</FieldLabel>
          <Input id="width" value="100%" />
        </Field>
        <Field @orientation="horizontal">
          <FieldLabel @class="w-1/2" @for="height">Height</FieldLabel>
          <Input id="height" value="25px" />
        </Field>
      </FieldGroup>
    </PopoverContent>
  </Popover>
</template>
