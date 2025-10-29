import { Metadata } from "next"

import { Metadata } from "next"

import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { ThemeWrapper } from "@/components/theme-wrapper"

export const metadata: Metadata = {
  title: "Atari Theme Demo",
  description: "A demonstration of the custom Atari theme.",
}

export default function AtariThemeDemoPage() {
  return (
    <ThemeWrapper
      defaultTheme="atari" // Apply the Atari theme to this page
      className="flex flex-col items-start gap-4"
    >
      <PageHeader className="pb-8">
        <PageHeaderHeading>Atari Theme Demo</PageHeaderHeading>
        <PageHeaderDescription>
          Welcome to the Atari theme demo! This page showcases various UI
          components with the custom Atari theme applied.
        </PageHeaderDescription>
      </PageHeader>
      <div className="space-y-8">
        {/* Text Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading">Text Elements</h2>
          <p>
            This is a paragraph of body text. It uses the default body font.
          </p>
          <h1 className="font-heading text-4xl">Heading 1 (Atari Font)</h1>
          <h2 className="font-heading text-3xl">Heading 2 (Atari Font)</h2>
          <h3 className="font-heading text-2xl">Heading 3 (Atari Font)</h3>
          <p>Another paragraph to demonstrate text flow and spacing.</p>
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading">Buttons</h2>
          <div className="flex space-x-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="destructive">Destructive Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="link">Link Button</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Card Title 1</CardTitle>
                <CardDescription>
                  This is a description for card 1.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Card content goes here. It can be text, forms, or other
                  elements.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Action Button</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="font-heading">Card Title 2</CardTitle>
                <CardDescription>
                  This is a description for card 2, demonstrating the
                  monochrome theme.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Input Fields */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading">Input Fields</h2>
          <div className="space-y-2">
            <Label htmlFor="demo-input">Sample Input</Label>
            <Input id="demo-input" placeholder="Type something..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-disabled-input">Disabled Input</Label>
            <Input id="demo-disabled-input" placeholder="Disabled" disabled />
          </div>
        </section>
        {/* Add other components as needed, e.g., Alert, Badge, Separator */}
        {/* Example for Alert (if available)
        <section className="space-y-4">
          <h2 className="text-2xl font-heading">Alerts</h2>
          <Alert>
            <AlertTitle className="font-heading">Alert Title</AlertTitle>
            <AlertDescription>This is a standard alert message.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle className="font-heading">Destructive Alert</AlertTitle>
            <AlertDescription>This is a destructive alert message.</AlertDescription>
          </Alert>
        </section>
        */}
      </div>
    </ThemeWrapper>
  )
}
