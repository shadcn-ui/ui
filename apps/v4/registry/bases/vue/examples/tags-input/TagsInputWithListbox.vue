<script setup lang="ts">
import { CheckIcon, ChevronDown } from 'lucide-vue-next'
import { ListboxContent, ListboxFilter, ListboxItem, ListboxItemIndicator, ListboxRoot, useFilter } from 'reka-ui'
import { ref } from 'vue'
import { Button } from '@/ui/button'
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/ui/tags-input'

const frameworks = [
  { value: 'next.js', label: 'Next.js' },
  { value: 'sveltekit', label: 'SvelteKit' },
  { value: 'nuxt', label: 'Nuxt' },
  { value: 'remix', label: 'Remix' },
  { value: 'astro', label: 'Astro' },
]

const searchTerm = ref('')
const frameworksRef = ref(['Nuxt', 'Remix'])
const open = ref(false)

const { contains } = useFilter({ sensitivity: 'base' })

const filteredFrameworks = computed(() =>
  searchTerm.value === ''
    ? frameworks
    : frameworks.filter(option => contains(option.label, searchTerm.value)),
)

watch(searchTerm, (f) => {
  if (f) {
    open.value = true
  }
})
</script>

<template>
  <Popover v-model:open="open">
    <ListboxRoot
      v-model="frameworksRef"
      highlight-on-hover
      multiple
    >
      <PopoverAnchor class="inline-flex w-[300px]">
        <TagsInput v-slot="{ modelValue: tags }" v-model="frameworksRef" class="w-full">
          <TagsInputItem v-for="item in tags" :key="item.toString()" :value="item.toString()">
            <TagsInputItemText />
            <TagsInputItemDelete />
          </TagsInputItem>

          <ListboxFilter v-model="searchTerm" as-child>
            <TagsInputInput placeholder="Frameworks..." @keydown.enter.prevent @keydown.down="open = true" />
          </ListboxFilter>

          <PopoverTrigger as-child>
            <Button size="icon-sm" variant="ghost" class="order-last self-start ml-auto">
              <ChevronDown class="size-3.5" />
            </Button>
          </PopoverTrigger>
        </TagsInput>
      </PopoverAnchor>

      <PopoverContent
        class="p-1"
        @open-auto-focus.prevent
      >
        <ListboxContent class="max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto empty:after:content-['No_options'] empty:p-1 empty:after:block" tabindex="0">
          <!-- <CommandEmpty>No results found.</CommandEmpty> -->
          <ListboxItem
            v-for="item in filteredFrameworks" :key="item.value" class="data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground [&_svg:not([class*=\'text-\'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=\'size-\'])]:size-4" :value="item.label" @select="() => {
              searchTerm = ''
            }"
          >
            <span>{{ item.label }}</span>

            <ListboxItemIndicator
              class="ml-auto inline-flex items-center justify-center"
            >
              <CheckIcon />
            </ListboxItemIndicator>
          </ListboxItem>
        </ListboxContent>
      </PopoverContent>
    </ListboxRoot>
  </Popover>
</template>
