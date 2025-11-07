import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/registry/radix/ui/avatar"
import { Badge } from "@/registry/radix/ui/badge"
import { Button } from "@/registry/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/radix/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/registry/radix/ui/field"
import { Input } from "@/registry/radix/ui/input"
import { IconPlaceholder } from "@/app/(app)/design/components/icon-placeholder"

export default function CardDemo() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="bg-background w-full max-w-[1500px] rounded-xl p-8">
        <div className="flex items-start gap-4">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" required />
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes</CardTitle>
              <CardDescription>
                Transcript from the meeting with the client.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Client requested dashboard redesign with focus on mobile
                responsiveness.
              </p>
              <ol className="mt-4 flex list-decimal flex-col gap-2 pl-6">
                <li>New analytics widgets for daily/weekly metrics</li>
                <li>Simplified navigation menu</li>
                <li>Dark mode support</li>
                <li>Timeline: 6 weeks</li>
                <li>Follow-up meeting scheduled for next Tuesday</li>
              </ol>
            </CardContent>
            <CardFooter>
              <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/maxleiter.png"
                    alt="@maxleiter"
                  />
                  <AvatarFallback>LR</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarImage
                    src="https://github.com/evilrabbit.png"
                    alt="@evilrabbit"
                  />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
              </div>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Is this an image?</CardTitle>
              <CardDescription>This is a card with an image.</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Image
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                alt="Photo by Drew Beamer"
                className="aspect-video object-cover dark:brightness-50 dark:grayscale"
                width={500}
                height={500}
              />
            </CardContent>
            <CardFooter className="flex items-center gap-2">
              <Badge variant="outline">
                <IconPlaceholder icon="PlaceholderIcon" /> 4
              </Badge>
              <Badge variant="outline">
                <IconPlaceholder icon="PlaceholderIcon" /> 2
              </Badge>
              <Badge variant="outline">
                <IconPlaceholder icon="PlaceholderIcon" /> 350m²
              </Badge>
              <div className="ml-auto font-medium tabular-nums">$135,000</div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
