import {
  Field,
  FieldError,
  FieldLabel,
} from '@/ember-ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';

<template>
  <Field data-invalid @class="w-full max-w-48">
    <FieldLabel>Fruit</FieldLabel>
    <Select>
      <SelectTrigger aria-invalid="true">
        <SelectValue @placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem @value="apple">Apple</SelectItem>
          <SelectItem @value="banana">Banana</SelectItem>
          <SelectItem @value="blueberry">Blueberry</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <FieldError>Please select a fruit.</FieldError>
  </Field>
</template>
