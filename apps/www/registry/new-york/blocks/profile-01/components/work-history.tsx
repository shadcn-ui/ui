import type { JSX } from "react"
import { Calendar, Clock, DollarSign } from "lucide-react"

import { Badge } from "@/registry/new-york/ui/badge"

interface WorkHistoryProps {
  projects: {
    title: string
    description: string
    technologies: string[]
    hours: number
    earnings: number
    date: string
  }[]
}

export default function WorkHistory({
  projects = [],
}: Readonly<WorkHistoryProps>): JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-background py-4 pl-4">
      <div className="flex items-baseline justify-between pr-4">
        <h3 className="mb-4 text-lg font-semibold">Work History</h3>
        <Badge>{projects.length} Projects</Badge>
      </div>

      <ul className="grid max-h-[320px] grid-cols-1 gap-2 overflow-y-auto pr-4">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col gap-4 rounded-lg border border-border bg-background p-4"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{project.title}</h4>
              <Badge>Completed</Badge>
            </div>
            <p className="text-balance text-sm text-foreground/80">
              {project.description}
            </p>

            <div className="flex flex-col gap-2">
              <ul className="flex items-center gap-2">
                {project.technologies.map((technology) => (
                  <li key={technology}>
                    <Badge>{technology}</Badge>
                  </li>
                ))}
              </ul>

              <ul className="flex items-center gap-2 text-sm text-foreground/60">
                <li className="flex items-center gap-1">
                  <Clock size={16} />
                  {project.hours} hrs
                </li>
                <li className="flex items-center gap-1">
                  <DollarSign size={16} />
                  {project.earnings}
                </li>
                <li className="flex items-center gap-1">
                  <Calendar size={16} />
                  {project.date}
                </li>
              </ul>
            </div>
          </article>
        ))}
      </ul>
    </div>
  )
}
