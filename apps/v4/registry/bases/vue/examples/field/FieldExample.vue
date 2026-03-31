<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CheckboxFields from "@/examples/field/CheckboxFields.vue"
import InputFields from "@/examples/field/InputFields.vue"
import InputOTPFields from "@/examples/field/InputOTPFields.vue"
import NativeSelectFields from "@/examples/field/NativeSelectFields.vue"
import RadioFields from "@/examples/field/RadioFields.vue"
import SelectFields from "@/examples/field/SelectFields.vue"
import SliderFields from "@/examples/field/SliderFields.vue"
import SwitchFields from "@/examples/field/SwitchFields.vue"
import TextareaFields from "@/examples/field/TextareaFields.vue"
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
