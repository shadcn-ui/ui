<script setup lang="ts">
import { ref } from 'vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertTitle,
  AspectRatio,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Combobox,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Label,
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Skeleton,
  Slider,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  toast,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@saaze/ui'
import {
  Bold,
  CalendarDays,
  ChevronDown,
  Command as CommandIcon,
  Italic,
  Search,
  Settings,
  Underline,
  User,
} from 'lucide-vue-next'

type DemoCategory = 'display' | 'layout' | 'forms' | 'overlays' | 'status'

const props = withDefaults(defineProps<{ category?: DemoCategory }>(), {
  category: undefined,
})

function showCategory(category: DemoCategory) {
  return !props.category || props.category === category
}

const accordionValue = ref('item-1')
const collapsibleOpen = ref(false)
const tab = ref('account')
const togglePressed = ref(false)
const toggleGroup = ref('bold')
const selectValue = ref('')
const radioValue = ref('monthly')
const sliderValue = ref([45])
const text = ref('')
const comboboxValue = ref<string | null>(null)
const commandOpen = ref(false)
const sheetOpen = ref(false)
const alertOpen = ref(false)

const comboboxOptions = [
  { value: 'next', label: 'Next.js', group: 'فریمورک‌ها' },
  { value: 'nuxt', label: 'Nuxt', group: 'فریمورک‌ها' },
  { value: 'vue', label: 'Vue', group: 'کتابخانه‌ها' },
  { value: 'react', label: 'React', group: 'کتابخانه‌ها' },
  { value: 'svelte', label: 'Svelte', group: 'کتابخانه‌ها' },
]

function showToast() {
  toast({
    title: 'تغییرات ذخیره شد',
    description: 'تنظیمات حساب شما با موفقیت به‌روزرسانی شد.',
  })
}
</script>

<template>
  <div class="grid w-full gap-10">
    <section v-if="showCategory('display')" class="grid gap-4">
      <h4 class="text-sm font-semibold">کارت، نشان، هشدار و آواتار</h4>
      <div class="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>گزارش فروش</CardTitle>
            <CardDescription>خلاصه عملکرد این ماه</CardDescription>
          </CardHeader>
          <CardContent class="grid gap-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">درآمد</span>
              <Badge>۱۲٫۴ میلیون تومان</Badge>
            </div>
            <Separator />
            <div class="flex items-center gap-3">
              <Avatar>
                <AvatarImage src="https://github.com/radix-vue.png" alt="کاربر نمونه" />
                <AvatarFallback>س</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <span class="text-sm font-medium">سارا احمدی</span>
                <span class="text-xs text-muted-foreground">مدیر فروش</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button size="sm">مشاهده گزارش</Button>
          </CardFooter>
        </Card>

        <div class="grid content-start gap-3">
          <Alert>
            <CalendarDays aria-hidden="true" />
            <AlertTitle>یادآوری</AlertTitle>
            <AlertDescription>جلسه تیم فردا ساعت ۱۰ برگزار می‌شود.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>پرداخت موفق</AlertTitle>
            <AlertDescription>تراکنش شما با موفقیت ثبت شد.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>خطا در ذخیره‌سازی</AlertTitle>
            <AlertDescription>اتصال شبکه را بررسی و دوباره تلاش کنید.</AlertDescription>
          </Alert>
          <div class="flex flex-wrap items-center gap-2">
            <Badge>پیش‌فرض</Badge>
            <Badge variant="secondary">ثانویه</Badge>
            <Badge variant="success">موفق</Badge>
            <Badge variant="warning">هشدار</Badge>
            <Badge variant="destructive">خطا</Badge>
            <Badge variant="outline">حاشیه‌دار</Badge>
          </div>
        </div>
      </div>
    </section>

    <section v-if="showCategory('layout')" class="grid gap-4">
      <h4 class="text-sm font-semibold">آکاردئون، جمع‌شونده و زبانه‌ها</h4>
      <div class="grid gap-4 md:grid-cols-2">
        <Accordion v-model="accordionValue" type="single" collapsible class="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>ارسال سفارش چقدر طول می‌کشد؟</AccordionTrigger>
            <AccordionContent>
              سفارش‌ها معمولاً بین ۲ تا ۴ روز کاری به دست شما می‌رسند.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>امکان مرجوعی وجود دارد؟</AccordionTrigger>
            <AccordionContent>تا ۷ روز پس از دریافت، امکان مرجوعی وجود دارد.</AccordionContent>
          </AccordionItem>
        </Accordion>

        <div class="grid content-start gap-4">
          <Collapsible v-model:open="collapsibleOpen" class="w-full">
            <div class="flex items-center justify-between rounded-md border p-3">
              <span class="text-sm font-medium">تنظیمات پیشرفته</span>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="icon-sm" aria-label="نمایش تنظیمات">
                  <ChevronDown
                    class="transition-transform"
                    :class="{ 'rotate-180': collapsibleOpen }"
                  />
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent class="mt-3 rounded-md border p-3 text-sm text-muted-foreground">
              اعلان‌های ایمیلی، گزارش هفتگی و همگام‌سازی تقویم را می‌توانید از اینجا مدیریت کنید.
            </CollapsibleContent>
          </Collapsible>

          <Tabs v-model="tab" class="w-full">
            <TabsList class="grid w-full grid-cols-2">
              <TabsTrigger value="account">حساب</TabsTrigger>
              <TabsTrigger value="security">امنیت</TabsTrigger>
            </TabsList>
            <TabsContent value="account" class="rounded-md border p-4 text-sm">
              اطلاعات حساب کاربری و مشخصات تماس.
            </TabsContent>
            <TabsContent value="security" class="rounded-md border p-4 text-sm">
              رمز عبور و تأیید دو مرحله‌ای.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>

    <section v-if="showCategory('forms')" class="grid gap-4">
      <h4 class="text-sm font-semibold">کنترل‌های فرم</h4>
      <div class="grid gap-5 md:grid-cols-2">
        <div class="grid gap-3">
          <Label for="demo-select">نوع اشتراک</Label>
          <Select v-model="selectValue">
            <SelectTrigger id="demo-select" class="w-full">
              <SelectValue placeholder="یک گزینه انتخاب کنید" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>اشتراک‌ها</SelectLabel>
                <SelectItem value="basic">پایه</SelectItem>
                <SelectItem value="pro">حرفه‌ای</SelectItem>
                <SelectItem value="team">تیمی</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Combobox v-model="comboboxValue" :options="comboboxOptions" />
          <Textarea v-model="text" persian-digits placeholder="توضیحات خود را بنویسید…" />
        </div>

        <div class="grid content-start gap-5">
          <RadioGroup v-model="radioValue" class="grid gap-2">
            <div class="flex items-center gap-2">
              <RadioGroupItem id="monthly" value="monthly" />
              <Label for="monthly">پرداخت ماهانه</Label>
            </div>
            <div class="flex items-center gap-2">
              <RadioGroupItem id="yearly" value="yearly" />
              <Label for="yearly">پرداخت سالانه</Label>
            </div>
          </RadioGroup>

          <div class="grid gap-2">
            <div class="flex items-center justify-between text-sm">
              <span>میزان پیشرفت</span>
              <span class="text-muted-foreground">{{ sliderValue[0] }}٪</span>
            </div>
            <Slider v-model="sliderValue" :min="0" :max="100" :step="1" />
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Toggle v-model:pressed="togglePressed" aria-label="تأکید متن">
              <Bold />
            </Toggle>
            <ToggleGroup v-model="toggleGroup" type="single">
              <ToggleGroupItem value="bold" aria-label="درشت">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="کج">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="زیرخط">
                <Underline />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </section>

    <section v-if="showCategory('overlays')" class="grid gap-4">
      <h4 class="text-sm font-semibold">لایه‌های رویی و منوها</h4>
      <div class="flex flex-wrap items-center gap-3">
        <Sheet v-model:open="sheetOpen">
          <SheetTrigger as-child>
            <Button variant="outline">باز کردن کشو</Button>
          </SheetTrigger>
          <SheetContent side="end">
            <SheetHeader>
              <SheetTitle>تنظیمات حساب</SheetTitle>
              <SheetDescription>تغییرات را ذخیره کنید یا پنجره را ببندید.</SheetDescription>
            </SheetHeader>
            <div class="grid gap-3 py-4 text-sm">
              <Label for="sheet-name">نام نمایشی</Label>
              <input
                id="sheet-name"
                class="h-9 rounded-md border border-input bg-background px-3 text-sm"
                value="سارا احمدی"
              />
            </div>
            <SheetFooter>
              <Button @click="sheetOpen = false">ذخیره</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <AlertDialog v-model:open="alertOpen">
          <AlertDialogTrigger as-child>
            <Button variant="destructive">حذف حساب</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف حساب کاربری؟</AlertDialogTitle>
              <AlertDialogDescription>
                این عملیات قابل بازگشت نیست و همه داده‌های شما حذف می‌شود.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction>حذف</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button variant="outline" size="icon" aria-label="تنظیمات">
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>تنظیمات حساب</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Popover>
          <PopoverTrigger as-child>
            <Button variant="outline">نمایش پاپ‌اور</Button>
          </PopoverTrigger>
          <PopoverContent class="grid gap-3">
            <p class="text-sm font-medium">فیلتر نتایج</p>
            <input
              class="h-9 rounded-md border border-input bg-background px-3 text-sm"
              placeholder="نام پروژه…"
            />
          </PopoverContent>
        </Popover>

        <HoverCard>
          <HoverCardTrigger as-child>
            <Button variant="link">@saaze_ui</Button>
          </HoverCardTrigger>
          <HoverCardContent class="grid gap-2 text-sm">
            <span class="font-medium">سازه UI</span>
            <span class="text-muted-foreground">کتابخانه فارسی و راست‌به‌چپ Vue 3</span>
          </HoverCardContent>
        </HoverCard>

        <Button variant="outline" @click="commandOpen = true">
          <Search />
          جستجوی سریع
          <kbd class="ms-auto rounded border bg-muted px-1.5 text-[10px] text-muted-foreground">Ctrl K</kbd>
        </Button>

        <Button variant="secondary" @click="showToast">نمایش اعلان</Button>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>فایل</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>سند جدید <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
              <MenubarItem>باز کردن</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>خروج</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>ویرایش</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>واگرد</MenubarItem>
              <MenubarItem>تکرار</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>محصولات</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div class="grid w-64 gap-2 p-3">
                  <NavigationMenuLink
                    class="rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                  >
                    <span class="font-medium">تحلیل داده</span>
                    <span class="block text-xs text-muted-foreground">گزارش‌های هوشمند</span>
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    class="rounded-md p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground"
                  >
                    <span class="font-medium">مدیریت تیم</span>
                    <span class="block text-xs text-muted-foreground">نقش‌ها و دسترسی‌ها</span>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink class="px-3 py-2 text-sm">مستندات</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </section>

    <section v-if="showCategory('status')" class="grid gap-4">
      <h4 class="text-sm font-semibold">نمایش داده و وضعیت</h4>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="grid gap-3">
          <Progress :model-value="62" />
          <div class="flex items-center gap-3">
            <Skeleton class="size-10 rounded-full" />
            <div class="grid flex-1 gap-2">
              <Skeleton class="h-4 w-2/3" />
              <Skeleton class="h-4 w-1/2" />
            </div>
          </div>
          <AspectRatio :ratio="16 / 9" class="overflow-hidden rounded-md bg-muted">
            <div class="flex h-full items-center justify-center text-sm text-muted-foreground">
              نسبت ۱۶ به ۹
            </div>
          </AspectRatio>
        </div>
        <div class="grid content-start gap-3 rounded-md border p-4 text-sm">
          <span class="font-medium">دسترسی سریع</span>
          <div class="flex items-center gap-2 text-muted-foreground">
            <CommandIcon class="size-4" />
            <span>برای باز کردن پالت فرمان‌ها Ctrl+K را بزنید.</span>
          </div>
          <div class="flex items-center gap-2 text-muted-foreground">
            <User class="size-4" />
            <span>پروفایل شما تکمیل شده است.</span>
          </div>
        </div>
      </div>
    </section>

    <CommandDialog v-if="showCategory('overlays')" v-model:open="commandOpen">
      <CommandInput placeholder="جستجوی فرمان…" />
      <CommandList>
        <CommandEmpty>فرمانی پیدا نشد.</CommandEmpty>
        <CommandGroup heading="پیشنهادها">
          <CommandItem value="calendar" @select="commandOpen = false">
            <CalendarDays />
            تقویم
            <CommandShortcut>⌘C</CommandShortcut>
          </CommandItem>
          <CommandItem value="settings" @select="commandOpen = false">
            <Settings />
            تنظیمات
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="حساب">
          <CommandItem value="profile" @select="commandOpen = false">
            <User />
            پروفایل
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>
