module RtlAccordion = {
  @react.component
  let make = (~children=React.null, ~className="", ~defaultValue=?) =>
    <BaseUi.Accordion.Root ?defaultValue dataSlot="accordion" className={`flex w-full flex-col ${className}`}>
      {children}
    </BaseUi.Accordion.Root>

  module Item = {
    @react.component
    let make = (~children=React.null, ~value: string) =>
      <BaseUi.Accordion.Item value dataSlot="accordion-item" className="not-last:border-b">
        {children}
      </BaseUi.Accordion.Item>
  }

  module Trigger = {
    @react.component
    let make = (~children=React.null) =>
      <BaseUi.Accordion.Header className="flex">
        <BaseUi.Accordion.Trigger
          dataSlot="accordion-trigger"
          className="focus-visible:ring-ring/50 focus-visible:border-ring focus-visible:after:border-ring **:data-[slot=accordion-trigger-icon]:text-muted-foreground group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-start text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ms-auto **:data-[slot=accordion-trigger-icon]:size-4"
        >
          {children}
          <Icons.ChevronDown
            dataSlot="accordion-trigger-icon"
            className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
          />
          <Icons.ChevronUp
            dataSlot="accordion-trigger-icon"
            className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
          />
        </BaseUi.Accordion.Trigger>
      </BaseUi.Accordion.Header>
  }

  module Content = {
    @react.component
    let make = (~children=React.null) =>
      <BaseUi.Accordion.Panel
        dataSlot="accordion-content"
        className="data-open:animate-accordion-down data-closed:animate-accordion-up overflow-hidden text-sm"
      >
        <div className="[&_a]:hover:text-foreground h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4">
          {children}
        </div>
      </BaseUi.Accordion.Panel>
  }
}

type item = {
  value: string,
  question: string,
  answer: string,
}

let items: array<item> = [
  {
    value: "item-1",
    question: "كيف يمكنني إعادة تعيين كلمة المرور؟",
    answer:
      "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
  },
  {
    value: "item-2",
    question: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
    answer:
      "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.",
  },
  {
    value: "item-3",
    question: "ما هي طرق الدفع التي تقبلونها؟",
    answer:
      "نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.",
  },
]

@react.component
let make = () =>
  <RtlAccordion defaultValue=["item-1"] className="max-w-md">
    {items
    ->Array.map(item =>
      <RtlAccordion.Item key={item.value} value={item.value}>
        <RtlAccordion.Trigger> {item.question->React.string} </RtlAccordion.Trigger>
        <RtlAccordion.Content> {item.answer->React.string} </RtlAccordion.Content>
      </RtlAccordion.Item>
    )
    ->React.array}
  </RtlAccordion>
