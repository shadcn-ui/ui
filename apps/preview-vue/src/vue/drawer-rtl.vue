<script setup lang="ts">
import { ref } from 'vue'
import Minus from "@material-symbols/svg-400/rounded/remove.svg?component"
import Plus from "@material-symbols/svg-400/rounded/add.svg?component"
import { Button } from '@/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'

const goal = ref(350)
</script>

<template>
  <Drawer>
    <DrawerTrigger as-child>
      <Button variant="outline">
        فتح الدرج
      </Button>
    </DrawerTrigger>
    <DrawerContent dir="rtl">
      <div class="mx-auto w-full max-w-sm">
        <DrawerHeader>
          <DrawerTitle>نقل الهدف</DrawerTitle>
          <DrawerDescription>حدد هدف نشاطك اليومي.</DrawerDescription>
        </DrawerHeader>
        <div class="p-4 pb-0">
          <div class="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8 shrink-0 rounded-full"
              :disabled="goal <= 200"
              @click="goal -= 10"
            >
              <Minus />
              <span class="sr-only">تقليل</span>
            </Button>
            <div class="flex-1 text-center">
              <div class="text-7xl font-bold tracking-tighter">
                {{ goal }}
              </div>
              <div class="text-muted-foreground text-[0.70rem] uppercase">
                سعرات حرارية/يوم
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              class="h-8 w-8 shrink-0 rounded-full"
              :disabled="goal >= 400"
              @click="goal += 10"
            >
              <Plus />
              <span class="sr-only">زيادة</span>
            </Button>
          </div>
        </div>
        <DrawerFooter>
          <Button>إرسال</Button>
          <DrawerClose as-child>
            <Button variant="outline">
              إلغاء
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </div>
    </DrawerContent>
  </Drawer>
</template>
