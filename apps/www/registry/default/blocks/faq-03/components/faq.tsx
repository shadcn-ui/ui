import { Fragment } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"
import { Button } from "@/registry/default/ui/button"

const groups = [
  {
    title: "General",
    items: [
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
    ],
  },
  {
    title: "Other",
    items: [
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
    ],
  },
]

export function FAQ() {
  return (
    <div className="flex flex-col bg-background p-6 md:p-4 w-full max-w-3xl m-auto">
      <div>
        <h2 className="text-center font-bold text-4xl hidden md:block">
          Frequently Asked Questions
        </h2>
        <h2 className="text-center font-bold text-3xl md:hidden">FAQ</h2>
        <div className="text-center text-lg md:text-xl text-muted-foreground mt-3">
          Updated 22 July 2024
        </div>
      </div>
      <div className="flex flex-col">
        {groups.map((group) => (
          <Fragment key={group.title}>
            <div className="text-2xl font-semibold mb-7 mt-16">
              {group.title}
            </div>
            <Accordion
              type="single"
              collapsible
              className="w-full gap-y-2 flex flex-col border-t"
            >
              {group.items.map((item) => (
                <AccordionItem
                  key={item.value}
                  value={item.value}
                  className="last-of-type:border-none"
                >
                  <AccordionTrigger className="text-primary/85 text-xl font-normal [&>svg]:h-7 [&>svg]:w-7 hover:no-underline">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base">
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Fragment>
        ))}
      </div>
      <Button variant="secondary" className="w-fit mx-auto mt-8">
        Have more questions? Contact us!
      </Button>
    </div>
  )
}
