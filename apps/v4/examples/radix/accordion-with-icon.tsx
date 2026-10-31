import {
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/styles/radix-nova/ui/accordion"

const items = [
  {
    value: "shipping",
    icon: TruckIcon,
    trigger: "What are your shipping options?",
    content:
      "We offer standard (5-7 days), express (2-3 days), and overnight shipping. Free shipping on international orders.",
  },
  {
    value: "payment",
    icon: CreditCardIcon,
    trigger: "What payment methods do you accept?",
    content:
      "We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.",
  },
  {
    value: "security",
    icon: ShieldCheckIcon,
    trigger: "Is my data secure?",
    content:
      "Yes. We use end-to-end encryption, SOC 2 Type II compliance, and regular third-party security audits.",
  },
]

export function AccordionWithIcon() {
  return (
    <Accordion type="single" collapsible defaultValue="shipping" className="max-w-lg">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>
            <item.icon />
            {item.trigger}
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
