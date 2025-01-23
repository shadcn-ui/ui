import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/default/ui/accordion"

const groups = [
  {
    title: "General FAQs",
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
    title: "Other FAQs",
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
    <div className="flex flex-col bg-background space-y-20 p-6 md:p-4 max-w-7xl w-full m-auto">
      <h2 className="text-center font-bold text-3xl lg:text-4xl">
        Frequently Asked Questions
      </h2>
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col lg:grid lg:grid-cols-3">
          <div className="text-2xl lg:text-3xl font-semibold col-span-1 mb-8">
            {group.title}
          </div>
          <Accordion
            type="single"
            collapsible
            className="col-span-2 w-full gap-y-2 flex flex-col"
          >
            {group.items.map((item) => (
              <AccordionItem
                key={item.value}
                value={item.value}
                className="first-of-type:border-t"
              >
                <AccordionTrigger className="text-primary text-xl font-normal [&>svg]:h-7 [&>svg]:w-7 hover:no-underline">
                  {item.label}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  )
}
