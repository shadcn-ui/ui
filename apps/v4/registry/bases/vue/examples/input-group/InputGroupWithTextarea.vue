<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupTextarea,
} from "@/ui/input-group"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Input Group with Textarea">
    <div class="grid w-full max-w-sm items-center gap-4">
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <IconPlaceholder
            lucide="MessageSquareIcon"
            tabler="IconMessageSquare"
            hugeicons="Message01Icon"
            phosphor="ChatIcon"
            remixicon="RiChat1Line"
          />
        </InputGroupAddon>
        <InputGroupTextarea placeholder="Type your message here..." />
      </InputGroup>

      <InputGroup>
        <InputGroupTextarea placeholder="Add a comment..." rows="4" />
        <InputGroupAddon align="inline-end">
          <IconPlaceholder
            lucide="SendIcon"
            tabler="IconSend"
            hugeicons="Send01Icon"
            phosphor="PaperPlaneRightIcon"
            remixicon="RiSendPlaneLine"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  </Example>
</template>
