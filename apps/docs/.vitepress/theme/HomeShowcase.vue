<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowLeft, CalendarCheck2, Check, Copy, Sparkles } from 'lucide-vue-next'
import { Button, DatePicker, Input, Label } from '@saaze/ui'
import { formatJalali, formatToman, parseNumber } from '@saaze/utils'

const deliveryDate = ref<Date | null>(null)
const amount = ref('')
const commandCopyState = ref<'idle' | 'copied' | 'failed'>('idle')

const installCommand = 'pnpm add @saaze/ui @saaze/utils'

const total = computed(() => {
  const parsed = parseNumber(amount.value)
  return formatToman(Number.isFinite(parsed) ? parsed : 0)
})

const deliveryLabel = computed(() =>
  deliveryDate.value ? formatJalali(deliveryDate.value, { pattern: 'dddd D MMMM YYYY' }) : null,
)

async function copyInstallCommand() {
  try {
    await navigator.clipboard.writeText(installCommand)
    commandCopyState.value = 'copied'
  } catch {
    commandCopyState.value = 'failed'
  }
}
</script>

<template>
  <section class="showcase">
    <div class="showcase__grid">
      <div class="showcase__copy">
        <span class="showcase__eyebrow">
          <Sparkles aria-hidden="true" />
          فارسی از روز اول
        </span>

        <h2>فارسی، فقط ترجمه نیست.</h2>
        <p>
          سازه UI با منطق راست‌به‌چپ، تقویم جلالی، رقم‌های فارسی و قالب‌بندی تومان ساخته شده است؛ نه
          اینکه بعداً به آن وصله شده باشد.
        </p>

        <ul class="showcase__list">
          <li>
            <Check aria-hidden="true" />
            <span>ویژگی‌های منطقی Tailwind برای چیدمان بدون جهت ثابت</span>
          </li>
          <li>
            <Check aria-hidden="true" />
            <span>تقویم جلالی کامل با پیمایش کلید و محدوده تاریخ</span>
          </li>
          <li>
            <Check aria-hidden="true" />
            <span>ابزارهای عدد، مبلغ و تاریخ برای پروژه‌های ایرانی</span>
          </li>
        </ul>

        <div class="showcase__install">
          <span>شروع سریع</span>
          <button
            class="showcase__command"
            type="button"
            dir="ltr"
            aria-label="کپی دستور نصب"
            @click="copyInstallCommand"
          >
            <code>{{ installCommand }}</code>
            <Check v-if="commandCopyState === 'copied'" aria-hidden="true" />
            <Copy v-else aria-hidden="true" />
          </button>
          <span class="showcase__copy-status" role="status" aria-live="polite">
            {{
              commandCopyState === 'copied'
                ? 'کپی شد'
                : commandCopyState === 'failed'
                  ? 'کپی نشد؛ دسترسی کلیپ‌بورد را بررسی کنید.'
                  : ''
            }}
          </span>
        </div>
      </div>

      <div class="showcase__preview">
        <div class="showcase__glow" aria-hidden="true"></div>

        <div class="showcase__window">
          <div class="showcase__window-bar">
            <span class="showcase__window-dots" aria-hidden="true"> <i></i><i></i><i></i> </span>
            <span>پیش‌فاکتور فروش</span>
          </div>

          <div class="showcase__form">
            <div class="showcase__field">
              <Label for="home-delivery-date">تاریخ تحویل</Label>
              <DatePicker
                id="home-delivery-date"
                v-model="deliveryDate"
                placeholder="انتخاب تاریخ جلالی"
              />
            </div>

            <div class="showcase__field">
              <Label for="home-amount">مبلغ سفارش</Label>
              <Input id="home-amount" v-model="amount" persian-digits placeholder="۲٬۵۰۰٬۰۰۰" />
            </div>

            <div class="showcase__summary">
              <span>مبلغ قابل پرداخت</span>
              <strong>{{ total }}</strong>
            </div>

            <Button class="showcase__submit">
              <span>ثبت پیش‌فاکتور</span>
              <ArrowLeft aria-hidden="true" />
            </Button>

            <p class="showcase__hint" :class="{ 'is-ready': deliveryLabel }" aria-live="polite">
              <CalendarCheck2 aria-hidden="true" />
              <span v-if="deliveryLabel">تحویل: {{ deliveryLabel }}</span>
              <span v-else>یک تاریخ جلالی انتخاب کنید تا خلاصه سفارش کامل شود.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase {
  margin: 0 auto;
  padding: 24px 24px 96px;
  max-width: 1152px;
}

.showcase__grid {
  display: grid;
  align-items: center;
  gap: 48px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 28px;
  padding: 32px 24px;
  background:
    radial-gradient(circle at 100% 0%, rgb(15 118 110 / 10%), transparent 42%), var(--vp-c-bg-soft);
}

@media (min-width: 768px) {
  .showcase {
    padding: 40px 32px 112px;
  }

  .showcase__grid {
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    padding: 48px;
  }
}

.showcase__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 999px;
  padding: 5px 12px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 600;
}

.showcase__eyebrow svg {
  width: 14px;
  height: 14px;
}

.showcase__copy h2 {
  margin: 20px 0 0;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
}

.showcase__copy > p {
  margin: 14px 0 0;
  max-width: 48ch;
  font-size: 15px;
  line-height: 2;
  color: var(--vp-c-text-2);
}

.showcase__list {
  display: grid;
  gap: 12px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.showcase__list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--vp-c-text-2);
}

.showcase__list svg {
  flex-shrink: 0;
  margin-top: 4px;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  padding: 3px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.showcase__install {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.showcase__command {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 7px 10px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  cursor: pointer;
  transition: border-color 150ms ease;
}

.showcase__command:hover {
  border-color: var(--vp-c-brand-1);
}

.showcase__command:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.showcase__command code {
  padding: 0;
  font-size: 12px;
}

.showcase__command svg {
  width: 14px;
  height: 14px;
}

.showcase__copy-status {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.showcase__preview {
  position: relative;
}

.showcase__glow {
  position: absolute;
  inset: 12% 8% -4%;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(13 148 136 / 28%), transparent 68%);
  filter: blur(30px);
}

.showcase__window {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background-color: var(--vp-c-bg);
  box-shadow: 0 24px 60px -24px rgb(15 23 42 / 32%);
  overflow: hidden;
}

.showcase__window-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 44px;
  padding: 0 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 12px;
}

.showcase__window-dots {
  display: inline-flex;
  gap: 5px;
}

.showcase__window-dots i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background-color: var(--vp-c-divider);
}

.showcase__window-dots i:first-child {
  background-color: #f2b134;
}

.showcase__window-dots i:nth-child(2) {
  background-color: #14b8a6;
}

.showcase__form {
  display: grid;
  gap: 16px;
  padding: 22px;
}

.showcase__field {
  display: grid;
  gap: 7px;
}

.showcase__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 12px;
  padding: 12px 14px;
  background-color: var(--vp-c-bg-soft);
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.showcase__summary strong {
  font-size: 16px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.showcase__submit {
  width: 100%;
}

.showcase__hint {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  font-size: 11.5px;
  line-height: 1.8;
  color: var(--vp-c-text-3);
}

.showcase__hint svg {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
}

.showcase__hint.is-ready {
  color: var(--vp-c-brand-1);
}
</style>
