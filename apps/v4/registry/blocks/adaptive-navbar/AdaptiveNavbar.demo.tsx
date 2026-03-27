import * as React from "react"
import {
  Home,
  MoreHorizontal,
  Search,
  User,
  Package2,
} from "lucide-react"
// import { motion } from "framer-motion" // Removed framer-motion
import { cn } from "@/lib/utils" // Assuming @/lib/utils exists
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/registry/new-york-v4/ui/navigation-menu"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york-v4/ui/sheet"


// --- AdaptiveNavbar Component Code ---
// (Pasted directly into the demo file to resolve import errors)

// --- Desktop Navigation ---

const desktopNavItems = [
  { title: "Features", href: "#features" },
  { title: "Pricing", href: "#pricing" },
  { title: "Blog", href: "#blog" },
  { title: "Docs", href: "#docs" },
]

const DesktopNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto hidden h-16 max-w-5xl items-center justify-between rounded-2xl border bg-background/80 px-6 backdrop-blur-sm md:flex",
        className
      )}
      {...props}
    >
      <a href="#" className="flex items-center gap-2 text-lg font-semibold">
        <Package2 className="h-6 w-6" />
        <span className="sr-only">Acme Inc</span>
        <span>Acme Inc</span>
      </a>
      <NavigationMenu>
        <NavigationMenuList>
          {desktopNavItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <a href={item.href} className={navigationMenuTriggerStyle()}>
                {item.title}
              </a>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Button variant="default" size="sm" asChild>
        <a href="#login">Get Started</a>
      </Button>
    </nav>
  )
})
DesktopNav.displayName = "DesktopNav"

// --- Mobile Navigation ---

const mobileNavItems = [
  { title: "Home", href: "#home", icon: Home },
  { title: "Search", href: "#search", icon: Search },
  { title: "Profile", href: "#profile", icon: User },
]

const MobileNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)

  return (
    <>
      <nav
        ref={ref}
        className={cn(
          "fixed inset-x-4 bottom-4 z-50 flex h-16 items-center justify-around rounded-2xl border bg-background/80 shadow-lg backdrop-blur-sm md:hidden",
          className
        )}
        {...props}
      >
        {mobileNavItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className="flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </a>
        ))}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              aria-label="Open more navigation items"
            >
              <MoreHorizontal className="h-5 w-5" />
              <span>More</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="h-[90dvh] rounded-t-2xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex h-full flex-col justify-between pb-12 pt-6">
              <div className="grid gap-4">
                {desktopNavItems.map((item) => (
                  <a
                    key={item.title}
                    href={item.href}
                    onClick={() => setIsSheetOpen(false)}
                    className="rounded-md p-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsSheetOpen(false)}
                asChild
              >
                <a href="#login">Get Started</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </nav>
    </>
  )
})
MobileNav.displayName = "MobileNav"

// --- Main Component ---

const AdaptiveNavbar = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => {
  return (
    <>
      <DesktopNav className={className} {...props} />
      <MobileNav className={className} {...props} />
    </>
  )
})
AdaptiveNavbar.displayName = "AdaptiveNavbar"

// --- End of AdaptiveNavbar Component Code ---

// --- Demo Component ---

export default function AdaptiveNavbarDemo() {
  return (
    // Set a light background for the demo page
    <div className="relative h-[200vh] w-full bg-background">
      {/* Render the navbar */}
      <AdaptiveNavbar />

      {/* Page content */}
      <div className="container mx-auto max-w-5xl px-4 pt-28">
        <h1 className="text-4xl font-bold tracking-tight">
          Adaptive Navbar Demo
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Scroll down to see the navbar in action. The top bar is visible on
          desktop, and the bottom bar is visible on mobile. Resize your browser
          window to see the change.
        </p>

        {/* Placeholder content to create scrolling */}
        <div className="mt-12 space-y-8">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-card p-6 text-card-foreground shadow-sm"
            >
              <h2 className="text-2xl font-semibold">Content Section {i + 1}</h2>
              <p className="mt-2 text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}