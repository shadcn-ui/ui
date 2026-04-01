import { on } from '@ember/modifier';

import { Button } from '@/ember-ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';
import { Textarea } from '@/ember-ui/textarea';

const handleSubmit = (event: Event) => {
  event.preventDefault();
};

<template>
  <div class="w-full max-w-4xl">
    <form {{on "submit" handleSubmit}}>
      <FieldSet>
        <FieldLegend>Profile</FieldLegend>
        <FieldDescription>Fill in your profile information.</FieldDescription>
        <FieldSeparator />
        <FieldGroup>
          <Field @orientation="responsive">
            <FieldContent>
              <FieldLabel @for="name">Name</FieldLabel>
              <FieldDescription>
                Provide your full name for identification
              </FieldDescription>
            </FieldContent>
            <Input id="name" placeholder="Evil Rabbit" required />
          </Field>
          <FieldSeparator />
          <Field @orientation="responsive">
            <FieldContent>
              <FieldLabel @for="lastName">Message</FieldLabel>
              <FieldDescription>
                You can write your message here. Keep it short, preferably under
                100 characters.
              </FieldDescription>
            </FieldContent>
            <Textarea
              class="min-h-[100px] resize-none sm:min-w-[300px]"
              id="message"
              placeholder="Hello, world!"
              required
            />
          </Field>
          <FieldSeparator />
          <Field @orientation="responsive">
            <Button type="submit">Submit</Button>
            <Button @variant="outline" type="button">
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  </div>
</template>
