import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/ember-ui/accordion';

const items = [
  {
    value: 'item-1',
    trigger: 'How do I reset my password?',
    content:
      "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a link to reset your password. The link will expire in 24 hours.",
  },
  {
    value: 'item-2',
    trigger: 'Can I change my subscription plan?',
    content:
      'Yes, you can upgrade or downgrade your plan at any time from your account settings. Changes will be reflected in your next billing cycle.',
  },
  {
    value: 'item-3',
    trigger: 'What payment methods do you accept?',
    content:
      'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.',
  },
];

<template>
  <Accordion @type="single" @collapsible={{true}} @defaultValue="item-1" @class="max-w-lg">
    {{#each items as |item|}}
      <AccordionItem @value={{item.value}}>
        <AccordionTrigger>{{item.trigger}}</AccordionTrigger>
        <AccordionContent>{{item.content}}</AccordionContent>
      </AccordionItem>
    {{/each}}
  </Accordion>
</template>
