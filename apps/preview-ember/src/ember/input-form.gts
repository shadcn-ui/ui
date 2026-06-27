import { Button } from '@/ember-ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';

<template>
  <form class="w-full max-w-sm">
    <FieldGroup>
      <Field>
        <FieldLabel @for="form-name">Name</FieldLabel>
        <Input id="form-name" type="text" placeholder="Evil Rabbit" required />
      </Field>
      <Field>
        <FieldLabel @for="form-email">Email</FieldLabel>
        <Input id="form-email" type="email" placeholder="john@example.com" />
        <FieldDescription>
          We'll never share your email with anyone.
        </FieldDescription>
      </Field>
      <div class="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel @for="form-phone">Phone</FieldLabel>
          <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
        </Field>
        <Field>
          <FieldLabel @for="form-country">Country</FieldLabel>
          <Select>
            <SelectTrigger id="form-country">
              <SelectValue @placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem @value="us">United States</SelectItem>
              <SelectItem @value="uk">United Kingdom</SelectItem>
              <SelectItem @value="ca">Canada</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <Field>
        <FieldLabel @for="form-address">Address</FieldLabel>
        <Input id="form-address" type="text" placeholder="123 Main St" />
      </Field>
      <Field @orientation="horizontal">
        <Button type="button" @variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </Field>
    </FieldGroup>
  </form>
</template>
