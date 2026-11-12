# پرسش‌نامه

الگوی فرم مرحله‌ای برای نمایش پرسش‌ها، گزینه‌ها و اقدام‌های پیمایش یا ارسال.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'

const questions = [
  { name: 'direction', required: true, prompt: 'در مرحله بعد چه چیزی را نمونه‌سازی کنیم؟' },
  { name: 'detail', required: false, prompt: 'چه مقدار جزئیات نمایش داده شود؟' },
]
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="questionnaire" />

## استفاده

```vue
<Questionnaire :items="questions" @submit.prevent="submitAnswers">
  <QuestionnaireProgress />
  <QuestionnaireItem
    v-for="question in questions"
    :key="question.name"
    :name="question.name"
    :required="question.required"
  >
    <QuestionnaireTitle>{{ question.prompt }}</QuestionnaireTitle>
    <QuestionnaireDescription>یک گزینه را انتخاب کنید.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="focused">خلاصه و متمرکز</QuestionnaireChoice>
      <QuestionnaireChoice value="complete">جریان کامل</QuestionnaireChoice>
      <QuestionnaireInput v-if="question.name === 'direction'" aria-label="پاسخ دیگر" />
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
```

`Questionnaire` اعتبارسنجی موردهای اجباری، پیشرفت و جابه‌جایی میان پرسش‌ها را مدیریت می‌کند؛ ذخیره‌سازی پاسخ‌ها همچنان با فرم میزبان است.
