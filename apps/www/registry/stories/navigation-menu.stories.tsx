import type { Meta, StoryObj } from "@storybook/react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/registry/default/ui/navigation-menu"

/**
 * A collection of links for navigating websites.
 */
const meta = {
  title: "ui/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  argTypes: {},
  render: (args) => (
    <NavigationMenu {...args}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Overview
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-96 p-2">
                <li>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    API Reference
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Getting Started
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Guides
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="https:www.google.com"
            target="_blank"
          >
            External
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NavigationMenu>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the navigation menu.
 */
export const Default: Story = {}
