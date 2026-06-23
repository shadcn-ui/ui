import * as React from "react"
import {
    Home,
    MoreHorizontal,
    Search,
    User,
    Package2,
} from "lucide-react"
// import { motion } from "framer-motion" // Removed framer-motion

// Assume these paths are configured in your tsconfig.json
import { cn } from "@/lib/utils"
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from "@/registry/new-york-v4/ui/navigation-menu"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/new-york-v4/ui/sheet"



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
            <a
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
            >
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Acme Inc</span>
                <span>Acme Inc</span>
            </a>
            <NavigationMenu>
                <NavigationMenuList>
                    {desktopNavItems.map((item) => (
                        <NavigationMenuItem key={item.title}>
                            {/* Replaced Next.js Link with a standard <a> tag styled as a nav link */}
                            <a href={item.href} className={navigationMenuTriggerStyle()}>
                                {item.title}
                            </a>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <Button variant="default" size="sm" asChild>
                {/* Replaced Next.js Link with a standard <a> tag */}
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
                    // Replaced Next.js Link with a standard <a> tag
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
                                    // Replaced Next.js Link with a standard <a> tag
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
                                {/* Replaced Next.js Link with a standard <a> tag */}
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

export { AdaptiveNavbar }