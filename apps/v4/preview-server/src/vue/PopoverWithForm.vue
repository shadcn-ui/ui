<script setup lang="ts">
import { Button } from "@/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/ui/popover"
</script>

<template>
  <Popover>
    <PopoverTrigger :as-child="true">
      <Button variant="outline">
        Open Popover
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-64" align="start">
      <PopoverHeader>
        <PopoverTitle>Dimensions</PopoverTitle>
        <PopoverDescription>
          Set the dimensions for the layer.
        </PopoverDescription>
      </PopoverHeader>
      <FieldGroup class="gap-4">
        <Field orientation="horizontal">
          <FieldLabel html-for="width" class="w-1/2">
            Width
          </FieldLabel>
          <Input id="width" default-value="100%" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel html-for="height" class="w-1/2">
            Height
          </FieldLabel>
          <Input id="height" default-value="25px" />
        </Field>
      </FieldGroup>
    </PopoverContent>
  </Popover>
</template>
