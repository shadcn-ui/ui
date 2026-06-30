<script setup lang="ts">
import { Button } from '@/ui/button'
import { Field } from '@/ui/field'
import { Input } from '@/ui/input'
</script>

<template>
  <Field orientation="horizontal">
    <Input type="search" placeholder="Search..." />
    <Button>Search</Button>
  </Field>
</template>
