import { Box, ChevronRight, HelpCircle, Info } from "lucide-react"

import { Button } from "@/registry/default/ui/button"

const links = [
  {
    title: "Jedi Training",
    description: "Learn the ways of the Force, you will.",
    icon: Box,
  },
  {
    title: "Galactic Support",
    description: "Help you, we can. Answers, you will find.",
    icon: HelpCircle,
  },
  {
    title: "About the Force",
    description: "More about the Force, you must know.",
    icon: Info,
  },
]

export function NotFound() {
  return (
    <div className="text-center">
      <p className="text-base font-semibold text-primary">404</p>
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
        Page not found
      </h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">
        Lost, this page is. In another system, it may be.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
        <Button variant="secondary" asChild>
          <a href="#">
            <span aria-hidden="true">&larr;</span> Go back
          </a>
        </Button>
        <Button className="-order-1 sm:order-none" asChild>
          <a href="#">Take me home</a>
        </Button>
      </div>
      <ul className="mt-16 grid lg:grid-cols-3 gap-y-3 gap-x-6">
        {links.map((link) => (
          <li
            key={link.title}
            className="relative group/link inline-flex cursor-pointer flex-col gap-12 sm:gap-16 lg:gap-20 bg-muted/50 hover:bg-accent rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring p-6"
          >
            <div className="flex items-center justify-between">
              <link.icon className="h-10 w-10" />
              <ChevronRight className="h-8 w-8 text-muted-foreground transition-colors group-hover/link:text-primary" />
            </div>
            <div className="text-start">
              <h3 className="text-lg lg:text-xl text-primary font-medium">
                {link.title}
              </h3>
              <p className="text-sm lg:text-base text-muted-foreground">
                {link.description}
              </p>
              <a
                href="#"
                className="absolute top-0 left-0 w-full h-full z-[+1]"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
