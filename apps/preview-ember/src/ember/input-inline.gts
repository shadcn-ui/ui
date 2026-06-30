import { Button } from '@/ember-ui/button';
import { Field } from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

<template>
  <Field @orientation="horizontal">
    <Input type="search" placeholder="Search..." />
    <Button>Search</Button>
  </Field>
</template>
