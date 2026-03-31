<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals getting started.",
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses.",
  },
  {
    name: "Enterprise",
    description: "Advanced features for large organizations.",
  },
]

const plan = ref(plans[0].name)

const selectedPlan = computed(() => plans.find(p => p.name === plan.value))
</script>

<template>
  <Select v-model="plan">
    <SelectTrigger class="h-auto! w-72">
      <SelectValue>
        <Item v-if="selectedPlan" size="xs" class="w-full p-0">
          <ItemContent class="gap-0">
            <ItemTitle>{{ selectedPlan.name }}</ItemTitle>
            <ItemDescription class="text-xs">
              {{ selectedPlan.description }}
            </ItemDescription>
          </ItemContent>
        </Item>
      </SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="p in plans" :key="p.name" :value="p.name">
          <Item size="xs" class="w-full p-0">
            <ItemContent class="gap-0">
              <ItemTitle>{{ p.name }}</ItemTitle>
              <ItemDescription class="text-xs">
                {{ p.description }}
              </ItemDescription>
            </ItemContent>
          </Item>
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
