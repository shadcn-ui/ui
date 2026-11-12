<script setup lang="ts">
import DemoBlock from '../.vitepress/theme/DemoBlock.vue'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  Bubble,
  BubbleContent,
  BubbleReactions,
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ChartContainer,
  ChartLegend,
  ChartLegendItem,
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  DirectionProvider,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Field,
  FieldError,
  FieldGroup,
  FieldDescription,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
  Kbd,
  KbdGroup,
  Marker,
  MarkerContent,
  MarkerIcon,
  Message,
  MessageContent,
  MessageFooter,
  MessageHeader,
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  NativeSelect,
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  Spinner,
  Switch,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
  Typography,
} from '@saaze/ui'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Search,
  Terminal,
  X,
} from 'lucide-vue-next'

defineProps<{ component: string }>()
</script>

<template>
  <DemoBlock>
    <div class="w-full">
      <div v-if="component === 'attachment'" class="max-w-md">
        <AttachmentGroup aria-label="پیوست‌های تصویری" class="mb-3">
          <Attachment
            v-for="image in [
              { name: 'workspace.png', type: 'PNG · 820 KB', src: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80' },
              { name: 'desk-reference.jpg', type: 'JPG · 1.1 MB', src: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=900&auto=format&fit=crop&q=80' },
              { name: 'office-reference.jpg', type: 'JPG · 940 KB', src: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80' },
            ]"
            :key="image.name"
            orientation="vertical"
            class="w-24"
          >
            <AttachmentMedia variant="image">
              <img :src="image.src" :alt="image.name" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle dir="ltr" class="text-left">{{ image.name }}</AttachmentTitle>
              <AttachmentDescription dir="ltr" class="text-left">{{ image.type }}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </AttachmentGroup>
        <div class="grid gap-2">
          <Attachment state="uploading" class="w-full">
            <AttachmentMedia><Spinner aria-label="در حال بارگذاری" /></AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle dir="ltr" class="text-left">sales-dashboard.pdf</AttachmentTitle>
              <AttachmentDescription dir="ltr" class="text-left">در حال بارگذاری · ۶۴٪</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="لغو بارگذاری"><X aria-hidden="true" /></AttachmentAction>
            </AttachmentActions>
          </Attachment>
          <Attachment class="w-full">
            <AttachmentMedia><FileText aria-hidden="true" /></AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle dir="ltr" class="text-left">message-renderer.tsx</AttachmentTitle>
              <AttachmentDescription dir="ltr" class="text-left">TypeScript · ۱۲ کیلوبایت</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="حذف فایل"><X aria-hidden="true" /></AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </div>
      </div>

      <div v-else-if="component === 'bubble'" class="grid gap-3">
        <Bubble align="start" variant="secondary">
          <BubbleContent>سلام، خلاصه گزارش را برایم می‌فرستی؟</BubbleContent>
        </Bubble>
        <Bubble align="end" variant="tinted">
          <BubbleContent>حتماً؛ فایل را همین‌جا پیوست کردم.</BubbleContent>
          <BubbleReactions>👍 ۲</BubbleReactions>
        </Bubble>
      </div>

      <ButtonGroup v-else-if="component === 'button-group'" aria-label="گروه اقدام‌ها">
        <Button variant="outline">ذخیره</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">اشتراک‌گذاری</Button>
        <ButtonGroupText>⌘K</ButtonGroupText>
      </ButtonGroup>

      <Carousel v-else-if="component === 'carousel'" class="max-w-xl px-10">
        <CarouselContent>
          <CarouselItem v-for="item in ['نمای کلی', 'گزارش‌ها', 'تنظیمات']" :key="item" class="basis-1/2">
            <div class="flex aspect-square items-center justify-center rounded-xl border border-border bg-card p-5 text-center font-medium">{{ item }}</div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious class="absolute -start-1 top-1/2 -translate-y-1/2"><ArrowRight aria-hidden="true" /></CarouselPrevious>
        <CarouselNext class="absolute -end-1 top-1/2 -translate-y-1/2"><ArrowLeft aria-hidden="true" /></CarouselNext>
      </Carousel>

      <ChartContainer
        v-else-if="component === 'chart'"
        class="mx-auto max-w-lg"
        label="نمودار فروش ماهانه"
        :config="{
          desktop: { label: 'رایانه رومیزی', color: 'var(--chart-1)' },
          mobile: { label: 'تلفن همراه', color: 'var(--chart-2)' },
        }"
      >
        <svg viewBox="0 0 360 190" class="h-48 w-full" aria-hidden="true">
          <path d="M32 30H350M32 70H350M32 110H350M32 150H350" stroke="hsl(var(--border))" stroke-dasharray="3 4" />
          <g
            v-for="(month, index) in [
              { name: 'فروردین', desktop: 56, mobile: 24 },
              { name: 'اردیبهشت', desktop: 92, mobile: 60 },
              { name: 'خرداد', desktop: 71, mobile: 36 },
              { name: 'تیر', desktop: 22, mobile: 57 },
              { name: 'مرداد', desktop: 63, mobile: 39 },
              { name: 'شهریور', desktop: 64, mobile: 42 },
            ]"
            :key="month.name"
          >
            <rect
              :x="45 + index * 50"
              :y="150 - month.desktop"
              width="15"
              :height="month.desktop"
              rx="3"
              fill="var(--color-desktop)"
            />
            <rect
              :x="63 + index * 50"
              :y="150 - month.mobile"
              width="15"
              :height="month.mobile"
              rx="3"
              fill="var(--color-mobile)"
            />
            <text :x="62 + index * 50" y="174" text-anchor="middle" fill="currentColor" font-size="9">
              {{ month.name.slice(0, 3) }}
            </text>
          </g>
        </svg>
        <ChartLegend class="mt-2">
          <ChartLegendItem><span class="size-2.5 rounded-sm bg-[var(--color-desktop)]" />رایانه رومیزی</ChartLegendItem>
          <ChartLegendItem><span class="size-2.5 rounded-sm bg-[var(--color-mobile)]" />تلفن همراه</ChartLegendItem>
        </ChartLegend>
      </ChartContainer>

      <CodeBlock v-else-if="component === 'code-block'" class="max-w-xl">
        <CodeBlockHeader>
          <CodeBlockTitle>hello.ts</CodeBlockTitle>
          <CodeBlockCopyButton value="console.log('سلام دنیا')"><span>کپی</span></CodeBlockCopyButton>
        </CodeBlockHeader>
        <CodeBlockContent>console.log('سلام دنیا')</CodeBlockContent>
      </CodeBlock>

      <DirectionProvider v-else-if="component === 'direction'" direction="rtl">
        <div class="rounded-lg border border-border bg-card p-5 text-start">
          <div class="font-medium">متن راست‌به‌چپ</div>
          <div class="mt-1 text-sm text-muted-foreground">جهت این بخش با DirectionProvider تنظیم شده است.</div>
        </div>
      </DirectionProvider>

      <Drawer v-else-if="component === 'drawer'">
        <DrawerTrigger as-child>
          <Button variant="outline">نمایش کشو</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>تنظیمات حساب</DrawerTitle>
            <DrawerDescription>جزئیات حساب خود را بررسی کنید.</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>

      <Empty v-else-if="component === 'empty'" class="border border-dashed border-border">
        <EmptyHeader>
          <EmptyMedia><FileText aria-hidden="true" /></EmptyMedia>
          <EmptyTitle>هنوز فایلی ندارید</EmptyTitle>
          <EmptyDescription>برای شروع، نخستین فایل خود را بارگذاری کنید.</EmptyDescription>
        </EmptyHeader>
        <Button size="sm">بارگذاری فایل</Button>
      </Empty>

      <FieldSet v-else-if="component === 'field'" class="max-w-md">
        <FieldLegend>مشخصات حساب</FieldLegend>
        <FieldDescription>این اطلاعات در فاکتورها و رایانامه‌ها نمایش داده می‌شود.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel for="preview-name">نام کامل</FieldLabel>
            <Input id="preview-name" autocomplete="off" placeholder="نام خود را وارد کنید" />
            <FieldDescription>نامی که در فاکتورها نمایش داده می‌شود.</FieldDescription>
          </Field>
          <Field data-invalid="">
            <FieldLabel for="preview-username">نام کاربری</FieldLabel>
            <Input id="preview-username" autocomplete="off" aria-invalid="true" />
            <FieldError>این نام کاربری قبلاً انتخاب شده است.</FieldError>
          </Field>
          <Field orientation="horizontal">
            <Switch id="preview-newsletter" />
            <FieldContent>
              <FieldLabel for="preview-newsletter">عضویت در خبرنامه</FieldLabel>
              <FieldDescription>دریافت خبرهای تازه از طریق رایانامه.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>

      <InputGroup v-else-if="component === 'input-group'" class="max-w-md">
        <InputGroupInput placeholder="جستجوی مستندات..." aria-label="جستجو" />
        <InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
      </InputGroup>

      <Item v-else-if="component === 'item'" variant="outline" class="max-w-lg">
        <ItemMedia><FileText aria-hidden="true" /></ItemMedia>
        <ItemContent>
          <ItemTitle>گزارش سه‌ماهه</ItemTitle>
          <ItemDescription>آخرین ویرایش: امروز</ItemDescription>
        </ItemContent>
        <ItemActions><Button size="sm" variant="outline">بازکردن</Button></ItemActions>
      </Item>

      <div v-else-if="component === 'kbd'" class="flex flex-wrap items-center gap-3">
        <span class="text-sm text-muted-foreground">بازکردن جستجو</span>
        <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>
      </div>

      <Marker v-else-if="component === 'marker'" variant="border" role="status">
        <MarkerIcon><Check aria-hidden="true" /></MarkerIcon>
        <MarkerContent>سه فایل با موفقیت بررسی شدند.</MarkerContent>
      </Marker>

      <Message v-else-if="component === 'message'" align="end">
        <MessageContent>
          <MessageHeader>شما · اکنون</MessageHeader>
          <Bubble variant="default" align="end"><BubbleContent>سلام! چه کمکی از دستم برمی‌آید؟</BubbleContent></Bubble>
          <MessageFooter>ارسال‌شده</MessageFooter>
        </MessageContent>
      </Message>

      <MessageScrollerProvider v-else-if="component === 'message-scroller'">
        <MessageScroller class="h-56 rounded-lg border border-border">
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <MessageScrollerItem message-id="report">
                <Message align="start"><MessageContent><Bubble variant="secondary"><BubbleContent>گزارش آماده است.</BubbleContent></Bubble></MessageContent></Message>
              </MessageScrollerItem>
              <MessageScrollerItem message-id="request">
                <Message align="end"><MessageContent><Bubble variant="default" align="end"><BubbleContent>ممنون، لطفاً خلاصه‌اش را هم بفرست.</BubbleContent></Bubble></MessageContent></Message>
              </MessageScrollerItem>
              <MessageScrollerItem message-id="summary">
                <Message align="start"><MessageContent><Bubble variant="secondary"><BubbleContent>حتماً. فروش این ماه ۱۲٪ رشد داشته است.</BubbleContent></Bubble></MessageContent></Message>
              </MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton class="absolute bottom-3 end-3" />
        </MessageScroller>
      </MessageScrollerProvider>

      <NativeSelect v-else-if="component === 'native-select'" class="max-w-xs" aria-label="انتخاب دوره">
        <option value="">انتخاب دوره</option>
        <option value="month">این ماه</option>
        <option value="year">امسال</option>
      </NativeSelect>

      <Questionnaire
        v-else-if="component === 'questionnaire'"
        :items="[{ name: 'direction', required: true }, { name: 'detail' }]"
        class="max-w-lg"
        @submit.prevent
      >
        <QuestionnaireProgress />
        <QuestionnaireItem name="direction" required>
          <QuestionnaireTitle>در مرحله بعد چه چیزی را نمونه‌سازی کنیم؟</QuestionnaireTitle>
          <QuestionnaireDescription>یک مسیر یا پاسخ دلخواه خود را انتخاب کنید.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="delegation">
              <span class="font-medium">واگذاری کار</span>
              <span class="block text-muted-foreground">نمایش روند ارجاع کار به متخصص.</span>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="questions">
              <span class="font-medium">پرسش‌ها</span>
              <span class="block text-muted-foreground">نمایش گزینه‌ها هنگام انتظار رابط.</span>
            </QuestionnaireChoice>
            <QuestionnaireChoice value="both"><span class="font-medium">هر دو با هم</span></QuestionnaireChoice>
            <QuestionnaireInput aria-label="پاسخ دیگر" placeholder="پاسخ دیگری بنویسید…" />
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireItem name="detail">
          <QuestionnaireTitle>چه مقدار جزئیات نمایش داده شود؟</QuestionnaireTitle>
          <QuestionnaireDescription>اگر مطمئن نیستید، می‌توانید از این پرسش بگذرید.</QuestionnaireDescription>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="focused">خلاصه و متمرکز</QuestionnaireChoice>
            <QuestionnaireChoice value="complete">جریان کامل</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireSkip />
          <QuestionnaireNext />
          <QuestionnaireSubmit />
        </QuestionnaireActions>
      </Questionnaire>

      <div v-else-if="component === 'spinner'" class="flex items-center gap-3">
        <Spinner />
        <span class="text-sm text-muted-foreground">در حال بارگذاری…</span>
      </div>

      <SidebarProvider v-else-if="component === 'sidebar'" class="min-h-64 overflow-hidden rounded-lg border border-border">
        <Sidebar class="h-64">
          <SidebarHeader><span class="text-sm font-semibold">فضای کاری سازه</span></SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>برنامه</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton is-active><FileText aria-hidden="true" /><span>نمای کلی</span></SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><FileText aria-hidden="true" /><span>گزارش‌ها</span></SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter><span class="text-xs text-muted-foreground">کاربر نمونه</span></SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset class="min-h-64">
          <div class="flex items-center gap-3 border-b border-border p-3">
            <SidebarTrigger aria-label="باز و بسته کردن نوار کناری" />
            <span class="text-sm text-muted-foreground">محتوای اصلی</span>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Trace v-else-if="component === 'trace'" class="max-w-xl">
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon><Terminal aria-hidden="true" /></TraceIcon>
              <TraceTitle>اجرای بررسی نوع‌ها</TraceTitle>
              <span class="text-xs text-muted-foreground">۲٫۱ ثانیه</span>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <TraceDescription>بررسی با موفقیت پایان یافت؛ خطایی گزارش نشد.</TraceDescription>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>

      <Typography v-else-if="component === 'typography'" class="max-w-xl">
        <h3>متن خوانا در همه بخش‌ها</h3>
        <p>این wrapper ریتم و فاصله‌بندی محتوای متنی را یکپارچه می‌کند.</p>
        <ul><li>سازگار با رنگ‌های معنایی</li><li>قابل استفاده برای Markdown</li></ul>
      </Typography>
    </div>
  </DemoBlock>
</template>
