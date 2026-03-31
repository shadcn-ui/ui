<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CheckboxFields from "./CheckboxFields.vue"
import InputFields from "./InputFields.vue"
import InputOTPFields from "./InputOTPFields.vue"
import NativeSelectFields from "./NativeSelectFields.vue"
import RadioFields from "./RadioFields.vue"
import SelectFields from "./SelectFields.vue"
import SliderFields from "./SliderFields.vue"
import SwitchFields from "./SwitchFields.vue"
import TextareaFields from "./TextareaFields.vue"
</script>

<template>
  <ExampleWrapper>
    <InputFields />
    <TextareaFields />
    <SelectFields />
    <CheckboxFields />
    <RadioFields />
    <SwitchFields />
    <SliderFields />
    <NativeSelectFields />
    <InputOTPFields />
  </ExampleWrapper>
</template>
