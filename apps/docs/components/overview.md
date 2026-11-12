# نمای کلی کامپوننت‌ها

<div class="saaze-badges">
  <span>RTL-first</span>
  <span>Radix Vue</span>
  <span>TypeScript</span>
  <span>Persian</span>
</div>

<p class="saaze-lead">
  مجموعه کامپوننت‌های تکمیلی سازه UI بر پایه Radix Vue ساخته شده‌اند؛ همه چیدمان‌ها با
  ویژگی‌های منطقی Tailwind نوشته شده‌اند و در حالت راست‌به‌چپ بدون تنظیم اضافه درست کار
  می‌کنند.
</p>

<script setup>
import NewComponentsDemo from '../demos/NewComponentsDemo.vue'
import newComponentsCode from '../demos/NewComponentsDemo.vue?raw'
import FormDemo from '../demos/FormDemo.vue'
import formDemoCode from '../demos/FormDemo.vue?raw'
</script>

## پیش‌نمایش کامپوننت‌ها

<DemoBlock title="کارت، فرم، منو، لایه‌های رویی و نمایش داده" description="همه نمونه‌ها با متن فارسی، رقم‌های فارسی و جهت راست‌به‌چپ." :code="newComponentsCode">

  <NewComponentsDemo />
</DemoBlock>

## فرم با VeeValidate و Zod

<DemoBlock title="اعتبارسنجی فارسی" description="ترکیب FormField، FormItem و FormMessage با طرح Zod." :code="formDemoCode">

  <FormDemo />
</DemoBlock>

## فهرست کامپوننت‌ها

| گروه                  | کامپوننت‌ها                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| پایه                  | `Button`، `Input`، `Textarea`، `Label`، `Checkbox`، `Switch`، `Toggle`، `ToggleGroup`، `RadioGroup`، `Slider`، `InputOTP`، `PinInput`، `NumberField`، `TagsInput`، `Form` |
| ناوبری و چیدمان       | `Accordion`، `Collapsible`، `AspectRatio`، `Separator`، `ScrollArea`، `Resizable`، `NavigationMenu`، `Menubar`، `Tabs`، `Pagination`، `Breadcrumb`، `Stepper`             |
| نمایش داده            | `Card`، `Badge`، `Avatar`، `Table`، `DataTable`، `Calendar`، `RangeCalendar`، `DatePicker`                                                                                |
| بازخورد و وضعیت       | `Alert`، `AlertDialog`، `Progress`، `Skeleton`، `Toast`، `Sonner`                                                                                                         |
| لایه‌های رویی و منوها | `Dialog`، `Sheet`، `Popover`، `Tooltip`، `HoverCard`، `DropdownMenu`، `ContextMenu`، `Command`، `Combobox`                                                                |

برای هر کامپوننت، صفحه مستقل در نوار کناری شامل پیش‌نمایش تعاملی و نمونه استفاده وجود دارد.
صفحه‌های [مسیر راهنما](/components/breadcrumb)، [جدول](/components/table)،
[تغییر اندازه](/components/resizable)، [ورودی یک‌بارمصرف](/components/input-otp) و
[منوی زمینه‌ای](/components/context-menu) نیز نمونه‌های اختصاصی دارند.

## نکته‌های راست‌به‌چپ

- کشو با `side="start"` یا `side="end"` باز می‌شود. نام‌های فیزیکی `left` و `right` نیز
  پذیرفته می‌شوند و بر اساس جهت صفحه به لبه منطقی درست تبدیل می‌شوند.
- منوها و پاپ‌اورها از جهت عنصر شناور و `ConfigProvider` پیروی می‌کنند؛ برای همین
  چیدمان `start`/`end` در RTL و LTR به‌درستی برعکس می‌شود.
- اعلان‌ها از پایین و لبه `end` ظاهر می‌شوند و انیمیشن آن‌ها در هر دو جهت صفحه خوانا است.
- برای جستجوهای فارسی، `Command` و `Combobox` رقم‌های فارسی/عربی را نرمال می‌کنند.
