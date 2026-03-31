<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/input-group"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Basic Input Group">
    <div class="grid w-full max-w-sm items-center gap-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconPlaceholder
            lucide="MailIcon"
            tabler="IconMail"
            hugeicons="Mail01Icon"
            phosphor="EnvelopeIcon"
            remixicon="RiMailLine"
          />
        </InputGroupAddon>
        <InputGroupInput type="email" placeholder="Email" />
      </InputGroup>

      <InputGroup>
        <InputGroupInput type="text" placeholder="Username" />
        <InputGroupAddon align="inline-end">
          @example.com
        </InputGroupAddon>
      </InputGroup>

      <InputGroup>
        <InputGroupAddon align="inline-start">
          https://
        </InputGroupAddon>
        <InputGroupInput type="text" placeholder="example.com" />
      </InputGroup>
    </div>
  </Example>
</template>
