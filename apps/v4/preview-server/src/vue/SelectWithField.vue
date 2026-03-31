<script setup lang="ts">
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
</script>

<template>
  <Field>
    <FieldLabel html-for="select-fruit">
      Favorite Fruit
    </FieldLabel>
    <Select>
      <SelectTrigger id="select-fruit">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">
            Apple
          </SelectItem>
          <SelectItem value="banana">
            Banana
          </SelectItem>
          <SelectItem value="blueberry">
            Blueberry
          </SelectItem>
          <SelectItem value="grapes">
            Grapes
          </SelectItem>
          <SelectItem value="pineapple">
            Pineapple
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <FieldDescription>
      Choose your favorite fruit from the list.
    </FieldDescription>
  </Field>
</template>
