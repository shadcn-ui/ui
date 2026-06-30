<script setup lang="ts">
import { Button } from '@/ui/button'
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/ui/field'
import { Input } from '@/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { Textarea } from '@/ui/textarea'
</script>

<template>
  <div class="w-full max-w-md py-6" dir="rtl">
    <form>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>طريقة الدفع</FieldLegend>
          <FieldDescription>
            جميع المعاملات آمنة ومشفرة
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel for="checkout-7j9-card-name-43j-rtl">
                الاسم على البطاقة
              </FieldLabel>
              <Input
                id="checkout-7j9-card-name-43j-rtl"
                placeholder="Evil Rabbit"
                required
              />
            </Field>
            <Field>
              <FieldLabel for="checkout-7j9-card-number-uw1-rtl">
                رقم البطاقة
              </FieldLabel>
              <Input
                id="checkout-7j9-card-number-uw1-rtl"
                placeholder="1234 5678 9012 3456"
                required
              />
              <FieldDescription>
                أدخل رقم البطاقة المكون من 16 رقمًا
              </FieldDescription>
            </Field>
            <div class="grid grid-cols-3 gap-4">
              <Field>
                <FieldLabel for="checkout-exp-month-ts6-rtl">
                  الشهر
                </FieldLabel>
                <Select default-value="">
                  <SelectTrigger id="checkout-exp-month-ts6-rtl">
                    <SelectValue placeholder="ش.ش" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">٠١</SelectItem>
                    <SelectItem value="02">٠٢</SelectItem>
                    <SelectItem value="03">٠٣</SelectItem>
                    <SelectItem value="04">٠٤</SelectItem>
                    <SelectItem value="05">٠٥</SelectItem>
                    <SelectItem value="06">٠٦</SelectItem>
                    <SelectItem value="07">٠٧</SelectItem>
                    <SelectItem value="08">٠٨</SelectItem>
                    <SelectItem value="09">٠٩</SelectItem>
                    <SelectItem value="10">١٠</SelectItem>
                    <SelectItem value="11">١١</SelectItem>
                    <SelectItem value="12">١٢</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel for="checkout-7j9-exp-year-f59-rtl">
                  السنة
                </FieldLabel>
                <Select default-value="">
                  <SelectTrigger id="checkout-7j9-exp-year-f59-rtl">
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="2029">2029</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel for="checkout-7j9-cvv-rtl">
                  CVV
                </FieldLabel>
                <Input id="checkout-7j9-cvv-rtl" placeholder="123" required />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>عنوان الفوترة</FieldLegend>
          <FieldDescription>
            عنوان الفوترة المرتبط بطريقة الدفع الخاصة بك
          </FieldDescription>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox
                id="checkout-7j9-same-as-shipping-wgm-rtl"
                :default-value="true"
              />
              <FieldLabel
                for="checkout-7j9-same-as-shipping-wgm-rtl"
                class="font-normal"
              >
                نفس عنوان الشحن
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel for="checkout-7j9-optional-comments-rtl">
                تعليقات
              </FieldLabel>
              <Textarea
                id="checkout-7j9-optional-comments-rtl"
                placeholder="أضف أي تعليقات إضافية"
                class="resize-none"
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit">إرسال</Button>
          <Button variant="outline" type="button">إلغاء</Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>
