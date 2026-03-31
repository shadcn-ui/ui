<script setup lang="ts">
import { ref } from "vue"
import { ButtonGroup } from "@/ui/button-group"
import { Input } from "@/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { Example } from "@/components/example"

const duration = ref("hours")
</script>

<template>
  <Example title="With Select and Input">
    <ButtonGroup>
      <Select v-model="duration">
        <SelectTrigger id="duration">
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectItem value="hours">
            Hours
          </SelectItem>
          <SelectItem value="days">
            Days
          </SelectItem>
          <SelectItem value="weeks">
            Weeks
          </SelectItem>
        </SelectContent>
      </Select>
      <Input />
    </ButtonGroup>
  </Example>
</template>
