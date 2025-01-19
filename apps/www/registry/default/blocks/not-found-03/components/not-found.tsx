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
      <ul className="mt-16 flex flex-col divide-y divide-border">
        {links.map((link) => (
          <li key={link.title} className="relative py-2 cursor-pointer">
            <div className="relative inline-flex flex-col sm:flex-row gap-4 rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground p-3 w-full justify-start">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border shadow-sm">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex flex-1 text-start min-h-12">
                <div>
                  <h3 className="text-lg text-primary font-medium">
                    {link.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {link.description}
                  </p>
                  <a
                    href="#"
                    className="absolute top-0 left-0 w-full h-full z-[+1]"
                  />
                </div>
                <ChevronRight className="ml-auto text-muted-foreground" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
