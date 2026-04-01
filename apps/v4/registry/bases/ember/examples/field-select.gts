import { Field, FieldDescription, FieldLabel } from '@/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';

<template>
  <div class="w-full max-w-md">
    <Field>
      <FieldLabel>Department</FieldLabel>
      <Select>
        <SelectTrigger>
          <SelectValue @placeholder="Choose department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem @value="engineering">Engineering</SelectItem>
          <SelectItem @value="design">Design</SelectItem>
          <SelectItem @value="marketing">Marketing</SelectItem>
          <SelectItem @value="sales">Sales</SelectItem>
          <SelectItem @value="support">Customer Support</SelectItem>
          <SelectItem @value="hr">Human Resources</SelectItem>
          <SelectItem @value="finance">Finance</SelectItem>
          <SelectItem @value="operations">Operations</SelectItem>
        </SelectContent>
      </Select>
      <FieldDescription>
        Select your department or area of work.
      </FieldDescription>
    </Field>
  </div>
</template>
