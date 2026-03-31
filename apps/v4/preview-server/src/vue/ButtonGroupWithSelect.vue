<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Field } from "@/ui/field"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Example } from "@/components"

const currency = ref("$")
</script>

<template>
  <Example title="With Select">
    <Field>
      <Label html-for="amount">
        Amount
      </Label>
      <ButtonGroup>
        <Select v-model="currency">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start">
            <SelectItem value="$">
              $
            </SelectItem>
            <SelectItem value="€">
              €
            </SelectItem>
            <SelectItem value="£">
              £
            </SelectItem>
          </SelectContent>
        </Select>
        <Input placeholder="Enter amount to send" />
        <Button variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight01Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </ButtonGroup>
    </Field>
  </Example>
</template>
