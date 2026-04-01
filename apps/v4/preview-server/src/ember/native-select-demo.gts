import {
  NativeSelect,
  NativeSelectOption,
} from '@/ember-ui/native-select';

<template>
  <NativeSelect>
    <NativeSelectOption value="">Select status</NativeSelectOption>
    <NativeSelectOption value="todo">Todo</NativeSelectOption>
    <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
    <NativeSelectOption value="done">Done</NativeSelectOption>
    <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
  </NativeSelect>
</template>
