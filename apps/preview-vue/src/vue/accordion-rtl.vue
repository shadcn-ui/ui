<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion'

const items = [
  {
    value: 'item-1',
    trigger: 'كيف يمكنني إعادة تعيين كلمة المرور؟',
    content:
      'انقر على \'نسيت كلمة المرور\' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.',
  },
  {
    value: 'item-2',
    trigger: 'هل يمكنني تغيير خطة الاشتراك الخاصة بي؟',
    content:
      'نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.',
  },
  {
    value: 'item-3',
    trigger: 'ما هي طرق الدفع التي تقبلونها؟',
    content:
      'نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.',
  },
]
</script>

<template>
  <div dir="rtl">
    <Accordion type="single" collapsible default-value="item-1" class="max-w-md">
      <AccordionItem
        v-for="item in items"
        :key="item.value"
        :value="item.value"
      >
        <AccordionTrigger>{{ item.trigger }}</AccordionTrigger>
        <AccordionContent>{{ item.content }}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
