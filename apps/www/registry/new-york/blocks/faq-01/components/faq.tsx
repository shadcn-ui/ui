import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/new-york/ui/accordion"
import { Button } from "@/registry/new-york/ui/button"

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
    <div className="flex flex-col bg-background p-6 md:p-10">
      <h2 className="font-medium text-4xl pb-3 lg:pb-14 lg:text-[4rem] lg:leading-[4.5rem]">
        FAQ
      </h2>
      <div className="flex flex-col-reverse items-start lg:grid-cols-[max-content_1fr] gap-9 lg:grid lg:gap-6">
        <div className="pt-6 p-8 bg-muted w-full lg:w-auto lg:min-w-96">
          <h3 className="font-medium text-3xl pb-4">still need help?</h3>
          <p className="pb-10 text-base lg:text-lg">
            Chat to us&nbsp;—
            <br />
            we'll&nbsp;respond as&nbsp;soon&nbsp;a&nbsp;possible.
          </p>
          <Button tabIndex={-1}>Ask question</Button>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full gap-y-2 flex flex-col"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="group/item border border-foreground transition bg-foreground hover:bg-background data-[state=open]:bg-background"
            >
              <AccordionTrigger className="font-medium text-xl lg:text-3xl text-primary-foreground p-4 lg:p-6 lg:pl-10 group-hover/item:text-primary group-hover/item:no-underline data-[state=open]:text-primary [&>svg]:h-7 [&>svg]:w-7 [&>svg]:text-primary-foreground group-hover/item:[&>svg]:text-primary [&[data-state=open]>svg]:text-primary">
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="text-sm px-4 pb-8 lg:px-10 lg:pb-10 lg:text-lg">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
