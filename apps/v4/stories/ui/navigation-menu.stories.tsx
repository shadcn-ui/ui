import type { Meta, StoryObj } from "@storybook/react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/registry/new-york-v4/ui/navigation-menu"

const meta: Meta<typeof NavigationMenu> = {
  title: "UI/NavigationMenu",
  component: NavigationMenu,
  parameters: { layout: "centered" },
}

export default meta
type Story = StoryObj<typeof NavigationMenu>

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-gradient-to-b p-6 no-underline outline-none select-none focus:shadow-md"
                    href="#"
                  >
                    <div className="mt-4 mb-2 text-lg font-medium">
                      shadcn/ui
                    </div>
                    <p className="text-muted-foreground text-sm leading-tight">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="text-sm leading-none font-medium">
                      Introduction
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Re-usable components built using Radix UI and Tailwind
                      CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="text-sm leading-none font-medium">
                      Installation
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      How to install dependencies and structure your app.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <a href="#">
                    <div className="text-sm leading-none font-medium">
                      Typography
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                      Styles for headings, paragraphs, lists, and more.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {[
                {
                  title: "Alert Dialog",
                  description:
                    "A modal dialog that interrupts the user with important content.",
                },
                {
                  title: "Hover Card",
                  description:
                    "For sighted users to preview content behind a link.",
                },
                {
                  title: "Progress",
                  description:
                    "Displays an indicator showing the completion progress.",
                },
                {
                  title: "Scroll Area",
                  description: "Visually or semantically separates content.",
                },
                {
                  title: "Tabs",
                  description:
                    "A set of layered sections of content known as tab panels.",
                },
                {
                  title: "Tooltip",
                  description:
                    "A popup that displays information related to an element.",
                },
              ].map((item) => (
                <li key={item.title}>
                  <NavigationMenuLink asChild>
                    <a href="#">
                      <div className="text-sm leading-none font-medium">
                        {item.title}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {item.description}
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
}
