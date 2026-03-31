<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "@/ui/input-group"
import { Example } from "@/components"
</script>

<template>
  <Example title="Input Group with Button">
    <div class="grid w-full max-w-sm items-center gap-4">
      <InputGroup>
        <InputGroupInput type="text" placeholder="Search..." />
        <InputGroupButton>
          <Button>
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="Search01Icon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
            />
          </Button>
        </InputGroupButton>
      </InputGroup>

      <InputGroup>
        <InputGroupButton>
          <Button variant="outline">
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
          </Button>
        </InputGroupButton>
        <InputGroupInput type="text" placeholder="Copy this text" />
      </InputGroup>

      <InputGroup>
        <InputGroupButton>
          <Button variant="outline" size="sm">
            -
          </Button>
        </InputGroupButton>
        <InputGroupInput type="number" placeholder="0" />
        <InputGroupButton>
          <Button variant="outline" size="sm">
            +
          </Button>
        </InputGroupButton>
      </InputGroup>
    </div>
  </Example>
</template>
