import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';

<template>
  <Select @disabled={{true}}>
    <SelectTrigger @class="w-full max-w-48">
      <SelectValue @placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem @value="apple">Apple</SelectItem>
        <SelectItem @value="banana">Banana</SelectItem>
        <SelectItem @value="blueberry">Blueberry</SelectItem>
        <SelectItem @value="grapes" @disabled={{true}}>Grapes</SelectItem>
        <SelectItem @value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
