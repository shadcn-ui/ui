<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  Combobox,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxViewport,
} from "@/ui/combobox"
import { Input } from "@/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
]
</script>

<template>
  <Example title="With Other Inputs">
    <Combobox :items="frameworks">
      <ComboboxInput placeholder="Select a framework" class="w-52" />
      <ComboboxList>
        <ComboboxViewport>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxItem
            v-for="item in frameworks"
            :key="item"
            :value="item"
          >
            {{ item }}
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxList>
    </Combobox>
    <Select>
      <SelectTrigger class="w-52">
        <SelectValue placeholder="Select a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem
            v-for="framework in frameworks"
            :key="framework"
            :value="framework"
          >
            {{ framework }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <Button
      variant="outline"
      class="w-52 justify-between font-normal text-muted-foreground"
    >
      Select a framework
      <IconPlaceholder
        lucide="ChevronDownIcon"
        tabler="IconSelector"
        hugeicons="UnfoldMoreIcon"
        phosphor="CaretUpDownIcon"
        remixicon="RiExpandUpDownLine"
      />
    </Button>
    <Input placeholder="Select a framework" class="w-52" />
    <InputGroup class="w-52">
      <InputGroupInput placeholder="Select a framework" />
      <InputGroupAddon align="inline-end">
        <IconPlaceholder
          lucide="ChevronDownIcon"
          tabler="IconSelector"
          hugeicons="UnfoldMoreIcon"
          phosphor="CaretUpDownIcon"
          remixicon="RiExpandUpDownLine"
        />
      </InputGroupAddon>
    </InputGroup>
  </Example>
</template>
