<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Pagination,
  Progress,
  SaazeProvider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@saaze/ui'

const direction = ref<'rtl' | 'ltr'>('rtl')
const page = ref(2)
</script>

<template>
  <SaazeProvider :dir="direction">
    <div :dir="direction" class="grid w-full max-w-md gap-4">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm text-muted-foreground">
          جهت فعلی: <strong class="text-foreground">{{ direction.toUpperCase() }}</strong>
        </p>
        <Button
          variant="outline"
          size="sm"
          @click="direction = direction === 'rtl' ? 'ltr' : 'rtl'"
        >
          تغییر جهت
        </Button>
      </div>

      <!-- هیچ‌کدام از این کامپوننت‌ها dir صریح ندارند؛ جهت را از SaazeProvider می‌گیرند. -->
      <Tabs default-value="one">
        <TabsList>
          <TabsTrigger value="one">نخست</TabsTrigger>
          <TabsTrigger value="two">دوم</TabsTrigger>
          <TabsTrigger value="three">سوم</TabsTrigger>
        </TabsList>
        <TabsContent value="one" class="text-sm text-muted-foreground">
          با کلیدهای جهت میان تب‌ها جابه‌جا شوید.
        </TabsContent>
      </Tabs>
      <Progress :model-value="40" aria-label="پیشرفت" />
      <Pagination v-model:page="page" :page-count="5" :show-labels="false" />
    </div>
  </SaazeProvider>
</template>
