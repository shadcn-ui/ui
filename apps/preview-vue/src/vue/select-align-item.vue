<script setup lang="ts">
import { ref } from 'vue'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { Switch } from '@/ui/switch'

const alignItemWithTrigger = ref(true)
</script>

<template>
  <FieldGroup class="w-full max-w-xs">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel for="align-item">Align Item</FieldLabel>
        <FieldDescription>Toggle to align the item with the trigger.</FieldDescription>
      </FieldContent>
      <Switch
        id="align-item"
        :checked="alignItemWithTrigger"
        @update:checked="(v: boolean) => (alignItemWithTrigger = v)"
      />
    </Field>
    <Field>
      <Select default-value="banana">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent :position="alignItemWithTrigger ? 'item-aligned' : 'popper'">
          <SelectGroup>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  </FieldGroup>
</template>
