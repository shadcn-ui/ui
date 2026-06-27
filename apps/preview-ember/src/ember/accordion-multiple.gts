import { array } from '@ember/helper';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/ember-ui/accordion';

const items = [
  {
    value: 'notifications',
    trigger: 'Notification Settings',
    content:
      'Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.',
  },
  {
    value: 'privacy',
    trigger: 'Privacy & Security',
    content:
      'Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.',
  },
  {
    value: 'billing',
    trigger: 'Billing & Subscription',
    content:
      'View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.',
  },
];

<template>
  <Accordion @type="multiple" @defaultValue={{(array "notifications")}} @class="max-w-lg">
    {{#each items as |item|}}
      <AccordionItem @value={{item.value}}>
        <AccordionTrigger>{{item.trigger}}</AccordionTrigger>
        <AccordionContent>{{item.content}}</AccordionContent>
      </AccordionItem>
    {{/each}}
  </Accordion>
</template>
