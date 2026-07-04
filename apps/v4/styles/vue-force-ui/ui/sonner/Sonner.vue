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
    rich-colors
    close-button
    :style="{
      '--normal-bg': 'var(--surface)',
      '--normal-text': 'var(--surface-foreground)',
      '--normal-border': 'var(--border)',
      '--border-radius': 'var(--radius)',
      '--width': '312px',
      '--success-bg': 'var(--success-subtle)',
      '--success-border': 'var(--success)',
      '--success-text': 'var(--success)',
      '--warning-bg': 'var(--warning-subtle)',
      '--warning-border': 'var(--warning)',
      '--warning-text': 'var(--warning)',
      '--info-bg': 'var(--info-subtle)',
      '--info-border': 'var(--info)',
      '--info-text': 'var(--info)',
      '--error-bg': 'var(--error-subtle)',
      '--error-border': 'var(--error)',
      '--error-text': 'var(--error)',
    }"
    :toast-options="{
      classNames: {
        toast: 'cn-toast !items-start',
        actionButton: '!bg-primary !text-primary-foreground',
        cancelButton: '!bg-secondary !text-secondary-foreground',
      },
    }"
    v-bind="props"
  >
    <template #success-icon>
      <IconPlaceholder
        lucide="CircleCheckIcon"
        materialSymbols="check_circle"
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
        materialSymbols="info"
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
        materialSymbols="warning"
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
        materialSymbols="dangerous"
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
          materialSymbols="progress_activity"
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
        materialSymbols="close"
        tabler="IconX"
        hugeicons="Cancel01Icon"
        phosphor="XIcon"
        remixicon="RiCloseLine"
        class="size-4"
      />
    </template>
  </Sonner>
</template>
