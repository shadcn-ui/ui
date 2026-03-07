"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/examples/radix/ui-rtl/accordion"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      question1: "How do I reset my password?",
      answer1:
        "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. ",
      question2: "Can I change my subscription plan?",
      answer2:
        "Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.",
      question3: "What payment methods do you accept?",
      answer3:
        "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      question1: "كيف يمكنني إعادة تعيين كلمة المرور؟",
      answer1:
        "انقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، أدخل عنوان بريدك الإلكتروني، وسنرسل لك رابطًا لإعادة تعيين كلمة المرور. سينتهي صلاحية الرابط خلال 24 ساعة.",
      question2: "هل يمكنني تغيير خطة الاشتراك الخاصة بي؟",
      answer2:
        "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت من إعدادات حسابك. ستظهر التغييرات في دورة الفوترة التالية.",
      question3: "ما هي طرق الدفع التي تقبلونها؟",
      answer3:
        "نقبل جميع بطاقات الائتمان الرئيسية و PayPal والتحويلات المصرفية. تتم معالجة جميع المدفوعات بأمان من خلال شركاء الدفع لدينا.",
    },
  },
  he: {
    dir: "rtl",
    values: {
      question1: "איך אני מאפס את הסיסמה שלי?",
      answer1:
        "לחץ על 'שכחתי סיסמה' בעמוד ההתחברות, הזן את כתובת האימייל שלך, ונשלח לך קישור לאיפוס הסיסמה. הקישור יפוג תוך 24 שעות.",
      question2: "האם אני יכול לשנות את תוכנית המנוי שלי?",
      answer2:
        "כן, אתה יכול לשדרג או להוריד את התוכנית שלך בכל עת מההגדרות של החשבון שלך. השינויים יבואו לידי ביטוי במחזור החיוב הבא.",
      question3: "אילו אמצעי תשלום אתם מקבלים?",
      answer3: "אנו מקבלים כרטיסי אשראי, PayPal והעברות בנקאיות.",
    },
  },
}

const items = [
  {
    value: "item-1",
    questionKey: "question1" as const,
    answerKey: "answer1" as const,
  },
  {
    value: "item-2",
    questionKey: "question2" as const,
    answerKey: "answer2" as const,
  },
  {
    value: "item-3",
    questionKey: "question3" as const,
    answerKey: "answer3" as const,
  },
] as const

export function AccordionRtl() {
  const { dir, t } = useTranslation(translations, "ar")

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="max-w-md"
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{t[item.questionKey]}</AccordionTrigger>
          <AccordionContent>{t[item.answerKey]}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
