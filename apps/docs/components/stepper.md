# مراحل

نمایش و کنترل مراحل یک فرایند چندمرحله‌ای، بر پایه Stepper در Radix Vue. جهت از ارائه‌دهنده سازه خوانده می‌شود، پس ترتیب مراحل و ناوبری با کلیدهای جهت در RTL درست است.

<script setup>
import StepperDemo from '../demos/StepperDemo.vue'
import demoCode from '../demos/StepperDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="فرایند سفارش" description="روی هر مرحله کلیک کنید یا با دکمه‌ها جابه‌جا شوید." :code="demoCode">

  <StepperDemo />
</DemoBlock>

## استفاده

```vue
<Stepper v-model="current">
  <StepperItem v-for="item in steps" :key="item.step" :step="item.step">
    <StepperTrigger>
      <StepperIndicator>{{ item.step }}</StepperIndicator>
      <StepperTitle>{{ item.title }}</StepperTitle>
      <StepperDescription>{{ item.description }}</StepperDescription>
    </StepperTrigger>
    <StepperSeparator />
  </StepperItem>
</Stepper>
```

## اجزا

`Stepper` ویژگی‌های `modelValue`، `defaultValue`، `orientation` (`horizontal` یا `vertical`)، `linear` و `dir` را می‌پذیرد. `StepperItem` با `step` شماره‌گذاری می‌شود و از طریق slot وضعیت `state` (`active`، `completed` یا `inactive`) را در اختیار می‌گذارد.
