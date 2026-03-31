<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSlot,
} from "@/ui/pin-input"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Masked Pin Input">
    <PinInput :mask="true" type="text">
      <PinInputGroup>
        <PinInputSlot v-for="(id, index) in 6" :key="id" :index="index" />
      </PinInputGroup>
    </PinInput>
  </Example>
</template>
