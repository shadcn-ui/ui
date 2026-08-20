import { Metadata } from "next"
import Link from "next/link"
import { FileX, Home, Search } from "lucide-react"

import { GoBackButton } from "@/components/go-back-button"
import { Button } from "@/registry/new-york-v4/ui/button"
import { ButtonGroup } from "@/registry/new-york-v4/ui/button-group"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"

const title = "404 - Page Not Found"
const description = "The page you are looking for does not exist."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      {
        url: `/og?title=${encodeURIComponent(
          title
        )}&description=${encodeURIComponent(description)}`,
      },
    ],
  },
}

const primaryActions = [
  { href: "/", label: "Go Home", icon: Home, variant: "default" as const },
  {
    href: "/docs",
    label: "Browse Docs",
    icon: Search,
    variant: "outline" as const,
  },
]

const quickLinks = [
  { href: "/docs/components", label: "Components" },
  { href: "/docs/blocks", label: "Blocks" },
  { href: "/charts/area", label: "Charts" },
  { href: "/docs/theming", label: "Theming" },
]

export default function NotFound() {
  return (
    <div className="from-background to-muted/20 flex min-h-screen items-center justify-center bg-gradient-to-br p-4 sm:p-6">
      <div className="mx-auto w-full max-w-2xl">
        <Card className="bg-card/80 shadow-lg backdrop-blur-sm">
          <CardContent>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileX className="h-8 w-8 sm:h-10 sm:w-10" />
                </EmptyMedia>
                <EmptyTitle className="text-3xl font-bold tracking-tight sm:text-4xl">
                  404
                </EmptyTitle>
                <EmptyDescription className="text-lg sm:text-xl">
                  Page Not Found
                </EmptyDescription>
              </EmptyHeader>

              <div className="space-y-3 text-center">
                <p className="text-muted-foreground px-2 text-sm leading-relaxed sm:px-0 sm:text-base">
                  The page you&apos;re looking for doesn&apos;t exist or has
                  been moved. Don&apos;t worry, even the best developers get
                  lost sometimes.
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Let&apos;s get you back to building amazing things.
                </p>
              </div>

              <EmptyContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {primaryActions.map((action) => {
                    const IconComponent = action.icon
                    return (
                      <Button
                        key={action.href}
                        asChild
                        variant={action.variant}
                        className="h-10 text-sm sm:h-11 sm:text-base"
                      >
                        <Link href={action.href}>
                          <IconComponent className="mr-2 h-4 w-4" />
                          {action.label}
                        </Link>
                      </Button>
                    )
                  })}
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-4 text-center">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Looking for something specific?
                    </p>
                    <ButtonGroup>
                      {quickLinks.map((link) => (
                        <Button
                          key={link.href}
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm"
                        >
                          <Link href={link.href}>{link.label}</Link>
                        </Button>
                      ))}
                    </ButtonGroup>
                  </div>
                </div>

                <div className="pt-4 text-center">
                  <GoBackButton className="text-xs hover:cursor-pointer sm:text-sm" />
                </div>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
