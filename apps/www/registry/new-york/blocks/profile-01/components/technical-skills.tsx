import type { JSX } from "react"

import { Progress } from "@/registry/new-york/ui/progress"

interface TechnicalSkillsProps {
  items: {
    label: string
    value: number
  }[]
}

export default function TechnicalSkills({
  items = [],
}: Readonly<TechnicalSkillsProps>): JSX.Element {
  return (
    <article className="rounded-lg border border-border bg-background py-4 pl-4">
      <h3 className="mb-4 text-lg font-semibold">Technical Skills</h3>
      <ul className="max-h-[320px] overflow-y-auto">
        {items.map((item) => (
          <li
            className="mb-4 flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-4"
            key={item.label}
          >
            <p className="w-full text-foreground/80 md:w-[30%] lg:w-[15%]">
              {item.label}
            </p>
            <Progress
              value={item.value}
              className="w-full md:w-[60%] lg:w-[80%]"
            />
            <p className="hidden text-foreground/80 md:block md:w-[10%] lg:w-[5%]">
              {item.value}
            </p>
          </li>
        ))}
      </ul>
    </article>
  )
}
