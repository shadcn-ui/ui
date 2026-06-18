"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/radix/ui/accordion"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"

const GENERAL_QUESTIONS = [
  {
    q: "How secure is my financial data with Ledger?",
    a: "We use bank-level AES-256 encryption, SOC 2 Type II certified infrastructure, and never store your credentials. All connections use read-only access tokens. We are a SEC registered investment advisor.",
  },
  {
    q: "How do I connect my bank or investment accounts?",
    a: "Go to Settings > Linked Accounts and search for your institution. We support over 12,000 banks and brokerages via Plaid and MX.",
  },
  {
    q: "Can I export my data for tax purposes?",
    a: "Yes. Navigate to Reports > Tax Export to download a CSV or PDF summary of your transactions, dividends, and capital gains for any tax year.",
  },
]

const BILLING_QUESTIONS = [
  {
    q: "What is the difference between Basic and Pro pricing tiers?",
    a: "Basic includes budgeting, goal tracking, and up to 3 linked accounts. Pro adds unlimited accounts, dividend tracking, portfolio analysis, and priority support.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Go to Settings > Billing > Manage Plan and click Cancel. Your access continues until the end of your current billing period.",
  },
  {
    q: "Do you offer a free trial?",
    a: "Yes. All new accounts start with a 14-day Pro trial. No credit card required.",
  },
]

const GOALS_QUESTIONS = [
  {
    q: "How do I set up a custom financial goal?",
    a: "Click New Goal from the Savings Targets card. Choose a category, set a target amount and date, and we'll calculate the monthly contribution needed.",
  },
  {
    q: "Can I track multiple goals at once?",
    a: "Yes. Pro accounts can track unlimited goals. Basic accounts support up to 3 active goals.",
  },
  {
    q: "How are monthly contributions calculated?",
    a: "We divide the remaining amount by the number of months until your target date, adjusted for your current savings rate and any auto-transfer schedules.",
  },
]

function QuestionList({
  questions,
}: {
  questions: { q: string; a: string }[]
}) {
  return (
    <Accordion type="single" collapsible defaultValue="item-0">
      {questions.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export function Faq() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="w-full">
            <TabsTrigger value="general" className="flex-1">
              General
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex-1">
              Billing
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex-1">
              Goals
            </TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <QuestionList questions={GENERAL_QUESTIONS} />
          </TabsContent>
          <TabsContent value="billing">
            <QuestionList questions={BILLING_QUESTIONS} />
          </TabsContent>
          <TabsContent value="goals">
            <QuestionList questions={GOALS_QUESTIONS} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Contact Support
        </Button>
        <Button variant="link" className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  )
}
