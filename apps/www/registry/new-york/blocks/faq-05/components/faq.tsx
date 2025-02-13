import { Search } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion"
import { Input } from "@/registry/new-york/ui/input"

const items = [
  {
    label: "What is the Force?",
    content:
      "The Force is a mystical energy field that binds the galaxy together.",
    value: "item-1",
  },
  {
    label: "Who are the Jedi and what is their purpose?",
    content:
      "The Jedi are peacekeepers of the galaxy who use the Force for good. Their purpose is to protect and maintain peace.",
    value: "item-2",
  },
  {
    label: "Who are the Sith and what are their goals?",
    content:
      "The Sith are followers of the dark side who seek power and control. Their ultimate goal is to dominate the galaxy.",
    value: "item-3",
  },
  {
    label: "Yoda, who is?",
    content:
      "A wise and powerful Jedi Master, Yoda is. Trained many Jedi, he has.",
    value: "item-4",
  },
  {
    label: "What is the Death Star?",
    content:
      "The Death Star is a massive space station and superweapon capable of destroying planets.",
    value: "item-5",
  },
  {
    label: "What is the Millennium Falcon?",
    content:
      "The Millennium Falcon is a legendary starship flown by Han Solo and Chewbacca.",
    value: "item-6",
  },
]

export function FAQ() {
  return (
    <div className="flex flex-col bg-background gap-6 p-6 md:p-4 w-full max-w-3xl m-auto">
      <h2 className="text-center font-medium text-4xl md:text-6xl">
        Frequently Asked Questions
      </h2>
      <p className="text-muted-foreground text-center text-xl mb-12">
        Can't find the answer you're looking for?{" "}
        <a className="cursor-pointer underline underline-offset-2 text-primary">
          Chat to our friendly team!
        </a>
      </p>
      <div className="flex flex-col gap-6 bg-secondary/50 rounded-xl p-6">
        <Accordion
          type="single"
          collapsible
          className="w-full gap-y-2 flex flex-col"
        >
          {items.map((item) => (
            <AccordionItem key={item.value} value={item.value}>
              <AccordionTrigger className="font-medium text-lg [&>svg]:h-7 [&>svg]:w-7">
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="text-lg text-muted-foreground pl-6">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
