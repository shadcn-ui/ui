import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"

const items = [
  {
    label: "What is the Force?",
    content:
      "The Force is a mystical energy field that binds the galaxy together.",
    value: "item-1",
  },
  {
    label: "Yoda, who is?",
    content:
      "A wise and powerful Jedi Master, Yoda is. Trained many Jedi, he has.",
    value: "item-2",
  },
  {
    label: "Who are the Jedi and what is their purpose?",
    content:
      "The Jedi are peacekeepers of the galaxy who use the Force for good. Their purpose is to protect and maintain peace.",
    value: "item-3",
  },
  {
    label: "Who are the Sith and what are their goals?",
    content:
      "The Sith are followers of the dark side who seek power and control. Their ultimate goal is to dominate the galaxy.",
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
    <div className="flex flex-col bg-background gap-6 p-6 md:p-4 w-full max-w-7xl m-auto">
      <h2 className="text-left md:text-center text-primary-foreground mb-8 font-black text-4xl md:text-[64px] md:leading-[70px]  [text-shadow:4px_4px_0_hsl(var(--foreground)),_1px_1px_0_hsl(var(--foreground)),_-1px_0_0_hsl(var(--foreground)),_0_-1px_0_hsl(var(--foreground))] md:[text-shadow:10px_10px_0_hsl(var(--foreground)),_1px_1px_0_hsl(var(--foreground)),_-1px_0_0_hsl(var(--foreground)),_0_-1px_0_hsl(var(--foreground))]">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-6">
        <Accordion
          type="single"
          collapsible
          className="grid grid-cols-1 md:grid-cols-2 w-full"
        >
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border h-fit border-foreground shadow-[10px_10px_0_hsl(var(--foreground))] px-5 md:mx-5 mb-5"
            >
              <AccordionTrigger className="font-black text-2xl [&>svg]:h-9 [&>svg]:w-9 [&>svg]:text-primary hover:no-underline">
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="text-base">
                {item.content}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
