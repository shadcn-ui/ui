<script setup lang="ts">
import {
  PinInput,
  PinInputGroup,
  PinInputSeparator,
  PinInputSlot,
} from '@/ui/pin-input'
</script>

<template>
  <PinInput :max-length="6">
    <PinInputGroup>
      <PinInputSlot :index="0" />
      <PinInputSlot :index="1" />
      <PinInputSlot :index="2" />
    </PinInputGroup>
    <PinInputSeparator />
    <PinInputGroup>
      <PinInputSlot :index="3" />
      <PinInputSlot :index="4" />
      <PinInputSlot :index="5" />
    </PinInputGroup>
  </PinInput>
</template>
