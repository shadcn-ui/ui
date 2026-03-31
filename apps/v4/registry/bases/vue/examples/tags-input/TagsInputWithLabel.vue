<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Label } from "@/ui/label"
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from "@/ui/tags-input"
import { Example } from "@/components/example"

const tags = ref(["TypeScript", "JavaScript", "Python"])
</script>

<template>
  <Example title="Tags Input with Label">
    <div class="grid w-full max-w-sm items-center gap-1.5">
      <Label html-for="skills">Skills</Label>
      <TagsInput id="skills" v-model="tags">
        <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
          <TagsInputItemText />
          <TagsInputItemDelete>
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
          </TagsInputItemDelete>
        </TagsInputItem>
        <TagsInputInput placeholder="Add skill..." />
      </TagsInput>
    </div>
  </Example>
</template>
