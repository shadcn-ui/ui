"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSub,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

//TODO: Find a way to display the submenu correctly

export const NavigationMenuSubmenus = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Sub menu</NavigationMenuTrigger>
          <NavigationMenuContent className="shadow-none">
            <NavigationMenuSub defaultValue="sub1">
              <NavigationMenuList className="grid md:w-[340px] md:grid-cols-2">
                <NavigationMenuItem value="sub1">
                  <NavigationMenuTrigger>Sub item one</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    Sub item one content
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem value="sub2">
                  <NavigationMenuTrigger className="w-full">
                    Sub item two
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    Sub item two content
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
              <NavigationMenuViewport />
            </NavigationMenuSub>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="https://github.com/shadcn/ui">
            Github
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuIndicator />
      </NavigationMenuList>

      <NavigationMenuViewport />
    </NavigationMenu>
  )
}
