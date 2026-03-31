<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  Stepper,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/ui/stepper"
import { Example } from "@/components/example"

const currentStep = ref(1)
</script>

<template>
  <Example title="Basic Stepper">
    <Stepper v-model="currentStep" class="w-full">
      <StepperItem :step="1">
        <StepperTrigger>
          <StepperIndicator>
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="User02Icon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
            />
          </StepperIndicator>
          <div class="flex flex-col text-left">
            <StepperTitle>Account</StepperTitle>
            <StepperDescription>Create your account</StepperDescription>
          </div>
        </StepperTrigger>
        <StepperSeparator />
      </StepperItem>

      <StepperItem :step="2">
        <StepperTrigger>
          <StepperIndicator>
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="Settings02Icon"
              phosphor="GearIcon"
              remixicon="RiSettings3Line"
            />
          </StepperIndicator>
          <div class="flex flex-col text-left">
            <StepperTitle>Profile</StepperTitle>
            <StepperDescription>Set up your profile</StepperDescription>
          </div>
        </StepperTrigger>
        <StepperSeparator />
      </StepperItem>

      <StepperItem :step="3">
        <StepperTrigger>
          <StepperIndicator>
            <IconPlaceholder
              lucide="CheckIcon"
              tabler="IconCheck"
              hugeicons="Tick02Icon"
              phosphor="CheckIcon"
              remixicon="RiCheckLine"
            />
          </StepperIndicator>
          <div class="flex flex-col text-left">
            <StepperTitle>Complete</StepperTitle>
            <StepperDescription>Finish setup</StepperDescription>
          </div>
        </StepperTrigger>
      </StepperItem>
    </Stepper>
  </Example>
</template>
