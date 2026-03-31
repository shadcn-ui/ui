<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner"
import { Toaster as Sonner } from "vue-sonner"

import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/components/icon-placeholder"

const props = defineProps<ToasterProps>()
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--popover)',
      '--normal-text': 'var(--popover-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
    }"
    v-bind="props"
  >
    <template #success-icon>
      <IconPlaceholder
        lucide="CircleCheckIcon"
        tabler="IconCircleCheck"
        hugeicons="CheckmarkCircle01Icon"
        phosphor="CheckCircleIcon"
        remixicon="RiCheckboxCircleLine"
        class="size-4"
      />
    </template>
    <template #info-icon>
      <IconPlaceholder
        lucide="InfoIcon"
        tabler="IconInfoCircle"
        hugeicons="InformationCircleIcon"
        phosphor="InfoIcon"
        remixicon="RiInformationLine"
        class="size-4"
      />
    </template>
    <template #warning-icon>
      <IconPlaceholder
        lucide="TriangleAlertIcon"
        tabler="IconAlertTriangle"
        hugeicons="Alert02Icon"
        phosphor="WarningIcon"
        remixicon="RiAlertLine"
        class="size-4"
      />
    </template>
    <template #error-icon>
      <IconPlaceholder
        lucide="OctagonXIcon"
        tabler="IconOctagonOff"
        hugeicons="CancelCircleIcon"
        phosphor="XCircleIcon"
        remixicon="RiCloseCircleLine"
        class="size-4"
      />
    </template>
    <template #loading-icon>
      <div>
        <IconPlaceholder
          lucide="Loader2Icon"
          tabler="IconLoader2"
          hugeicons="Loading03Icon"
          phosphor="SpinnerGapIcon"
          remixicon="RiLoader4Line"
          class="size-4 animate-spin"
        />
      </div>
    </template>
    <template #close-icon>
      <IconPlaceholder
        lucide="XIcon"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        class="size-4"
      />
    </template>
  </Sonner>
</template>
