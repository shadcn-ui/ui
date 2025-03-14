import { Briefcase, GraduationCap, Star } from "lucide-react"

import { cn } from "@/lib/utils"

const timeline = [
  {
    id: 1,
    content: "Graduated from",
    target: "Harvard University",
    href: "#",
    date: "May 15",
    datetime: "2018-05-15",
    icon: GraduationCap,
    iconBackground: "bg-foreground",
  },
  {
    id: 2,
    content: "Started working at",
    target: "Google",
    href: "#",
    date: "Jul 10",
    datetime: "2018-07-10",
    icon: Briefcase,
    iconBackground: "bg-foreground",
  },
  {
    id: 3,
    content: "Promoted to",
    target: "Senior Developer",
    href: "#",
    date: "Sep 20",
    datetime: "2020-09-20",
    icon: Star,
    iconBackground: "bg-foreground",
  },
  {
    id: 4,
    content: "Received award for",
    target: "Employee of the Year",
    href: "#",
    date: "Dec 15",
    datetime: "2021-12-15",
    icon: Star,
    iconBackground: "bg-foreground",
  },
  {
    id: 5,
    content: "Started leading",
    target: "AI Research Team",
    href: "#",
    date: "Jan 5",
    datetime: "2023-01-05",
    icon: Briefcase,
    iconBackground: "bg-foreground",
  },
]

export function Feed() {
  return (
    <div className="flow-root">
      <ul role="list" className="-mb-8">
        {timeline.map((event, eventIdx) => (
          <li key={event.id}>
            <div className="relative pb-8">
              {eventIdx !== timeline.length - 1 ? (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={cn(
                      event.iconBackground,
                      "flex h-8 w-8 items-center justify-center rounded-full ring-8 ring-background"
                    )}
                  >
                    <event.icon
                      className="h-5 w-5 text-background"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-300">
                      {event.content}&nbsp;
                      <a
                        href={event.href}
                        className="font-medium text-gray-900 dark:text-gray-100"
                      >
                        {event.target}
                      </a>
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-300">
                    <time dateTime={event.datetime}>{event.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
