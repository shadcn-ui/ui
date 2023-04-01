"use client"

import {
  AtSign,
  Bell,
  BellOff,
  ChevronDown,
  Circle,
  CreditCard,
  Eye,
  Plus,
  Star,
} from "lucide-react"

import { CalendarDateRangePicker } from "@/components/examples/calendar/date-range-picker"
import { Icons } from "@/components/icons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function DemoPage() {
  return (
    <div className="grid grid-cols-3 items-start justify-center gap-6 rounded-md py-8">
      <div className="grid items-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report an issue</CardTitle>
            <CardDescription>
              What area are you having problems with?
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="area">Area</Label>
                <Select defaultValue="billing">
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent className="w-[300px]">
                    <SelectItem value="team">Team</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="account">Account Management</SelectItem>
                    <SelectItem value="deployments">Deployments</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Security Level</Label>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Severity 1 (Highest)</SelectItem>
                    <SelectItem value="2">Severity 2</SelectItem>
                    <SelectItem value="3">Severity 3</SelectItem>
                    <SelectItem value="4">Severity 4 (Lowest)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="I need help with..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please include all billing information relevant to your issue."
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between space-x-2">
            <Button variant="ghost">Cancel</Button>
            <Button>Submit</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>
              Add a new payment method to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <RadioGroup defaultValue="card" className="grid grid-cols-3 gap-4">
              <Label
                htmlFor="card"
                className="[&:has([data-state=checked])]:border-primary hover:bg-accent hover:text-accent-foreground bg-popover border-muted flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem value="card" id="card" className="sr-only" />
                <CreditCard className="mb-3 h-6 w-6" />
                Card
              </Label>
              <Label
                htmlFor="paypal"
                className="[&:has([data-state=checked])]:border-primary hover:bg-accent hover:text-accent-foreground bg-popover border-muted flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem
                  value="paypal"
                  id="paypal"
                  className="sr-only"
                />
                <Icons.paypal className="mb-3 h-6 w-6" />
                Paypal
              </Label>
              <Label
                htmlFor="apple"
                className="[&:has([data-state=checked])]:border-primary hover:bg-accent hover:text-accent-foreground bg-popover border-muted flex flex-col items-center justify-between rounded-md border-2 p-4"
              >
                <RadioGroupItem value="apple" id="apple" className="sr-only" />
                <Icons.apple className="mb-3 h-6 w-6" />
                Apple Pay
              </Label>
            </RadioGroup>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="First Last" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="number">Card number</Label>
              <Input id="number" placeholder="" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="month">Expires</Label>
                <Select>
                  <SelectTrigger id="month">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">January</SelectItem>
                    <SelectItem value="2">February</SelectItem>
                    <SelectItem value="3">March</SelectItem>
                    <SelectItem value="4">April</SelectItem>
                    <SelectItem value="5">May</SelectItem>
                    <SelectItem value="6">June</SelectItem>
                    <SelectItem value="7">July</SelectItem>
                    <SelectItem value="8">August</SelectItem>
                    <SelectItem value="9">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="year">Year</Label>
                <Select>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={`${new Date().getFullYear() + i}`}
                      >
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">Year</Label>
                <Input id="cvc" placeholder="CVC" />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Continue</Button>
          </CardFooter>
        </Card>
      </div>
      <div className="grid items-start gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              Invite your team members to collaborate.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://avatar.vercel.sh/shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">shadcn</p>
                  <p className="text-muted-foreground text-sm">m@example.com</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Owner{" "}
                    <ChevronDown className="text-muted-foreground ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Select new role..." />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup className="p-1.5">
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Viewer</p>
                          <p className="text-muted-foreground text-sm">
                            Can view and comment.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Developer</p>
                          <p className="text-muted-foreground text-sm">
                            Can view, comment and edit.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Billing</p>
                          <p className="text-muted-foreground text-sm">
                            Can view, comment and manage billing.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Owner</p>
                          <p className="text-muted-foreground text-sm">
                            Admin-level access to all resources.
                          </p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="https://avatar.vercel.sh/benoit" />
                  <AvatarFallback>BN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">benoit</p>
                  <p className="text-muted-foreground text-sm">b@example.com</p>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Member{" "}
                    <ChevronDown className="text-muted-foreground ml-2 h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="end">
                  <Command>
                    <CommandInput placeholder="Select new role..." />
                    <CommandList>
                      <CommandEmpty>No roles found.</CommandEmpty>
                      <CommandGroup className="p-1.5">
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Viewer</p>
                          <p className="text-muted-foreground text-sm">
                            Can view and comment.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Developer</p>
                          <p className="text-muted-foreground text-sm">
                            Can view, comment and edit.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Billing</p>
                          <p className="text-muted-foreground text-sm">
                            Can view, comment and manage billing.
                          </p>
                        </CommandItem>
                        <CommandItem className="flex flex-col items-start space-y-1 p-2">
                          <p>Owner</p>
                          <p className="text-muted-foreground text-sm">
                            Admin-level access to all resources.
                          </p>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="date" className="shrink-0">
                Pick a date
              </Label>
              <CalendarDateRangePicker className="[&>button]:w-[260px]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>
              Choose what you want to be notified about.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-1 p-1.5">
            <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
              <Bell className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Everything</p>
                <p className="text-muted-foreground text-sm">
                  Email digest, mentions & all activity.
                </p>
              </div>
            </div>
            <div className="bg-accent text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
              <AtSign className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Available</p>
                <p className="text-muted-foreground text-sm">
                  Only mentions and comments.
                </p>
              </div>
            </div>
            <div className="hover:bg-accent hover:text-accent-foreground flex items-center space-x-4 rounded-[0.24rem] p-2">
              <BellOff className="h-5 w-5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">Ignoring</p>
                <p className="text-muted-foreground text-sm">
                  Turn off all notifications.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4">
            <CardTitle>Share this document</CardTitle>
            <CardDescription>
              Anyone with the link can view this document.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input value="http://example.com/link/to/document" readOnly />
              <Button variant="secondary" className="shrink-0">
                Copy Link
              </Button>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <h4 className="text-sm font-medium">People with access</h4>
              <div className="grid gap-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://avatar.vercel.sh/shadcn" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">shadcn</p>
                      <p className="text-muted-foreground text-sm">
                        m@example.com
                      </p>
                    </div>
                  </div>
                  <Select defaultValue="edit">
                    <SelectTrigger className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://avatar.vercel.sh/benoit" />
                      <AvatarFallback>BN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">benoit</p>
                      <p className="text-muted-foreground text-sm">
                        b@example.com
                      </p>
                    </div>
                  </div>
                  <Select defaultValue="view">
                    <SelectTrigger className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src="https://avatar.vercel.sh/pedro" />
                      <AvatarFallback>PD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">pedro</p>
                      <p className="text-muted-foreground text-sm">
                        p@example.com
                      </p>
                    </div>
                  </div>
                  <Select defaultValue="view">
                    <SelectTrigger className="ml-auto w-[110px]">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="edit">Can edit</SelectItem>
                      <SelectItem value="view">Can view</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid items-start gap-6">
        <Card>
          <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
            <div className="space-y-1">
              <CardTitle>shadcn/ui</CardTitle>
              <CardDescription>
                Beautifully designed components built with Radix UI and Tailwind
                CSS.
              </CardDescription>
            </div>
            <div className="bg-secondary text-secondary-foreground flex items-center space-x-1 rounded-md">
              <Button variant="secondary" className="px-3">
                <Star className="mr-2 h-4 w-4" />
                Star
              </Button>
              <Separator orientation="vertical" className="h-[20px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="px-2">
                    <ChevronDown className="text-muted-foreground h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  alignOffset={-5}
                  className="w-[200px]"
                  forceMount
                >
                  <DropdownMenuLabel>Suggested Lists</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Future Ideas
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>My Stack</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Inspiration
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" /> Create List
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground flex space-x-4 text-sm">
              <div className="flex items-center">
                <Circle className="mr-1 h-3 w-3 fill-sky-400 text-sky-400" />
                TypeScipt
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-3 w-3" />
                10k
              </div>
              <div>Updated April 2023</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-0 p-6 pb-0">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Enter your email below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6">
            <div className="grid grid-cols-2 gap-6">
              <Button variant="outline">
                <Icons.gitHub className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline">
                <Icons.google className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-0 p-6 pt-0">
            <Button className="w-full">Create account</Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cookie Settings</CardTitle>
            <CardDescription>Manage your cookie settings here.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="necessary" className="flex flex-col space-y-1">
                <span>Strictly Necessary</span>
                <span className="text-muted-foreground font-normal leading-snug">
                  These cookies are essential in order to use the website and
                  use its features.
                </span>
              </Label>
              <Switch id="necessary" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Functional Cookies</span>
                <span className="text-muted-foreground font-normal leading-snug">
                  These cookies allow the website to provide personalized
                  functionality.
                </span>
              </Label>
              <Switch id="functional" />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="performance" className="flex flex-col space-y-1">
                <span>Performance Cookies</span>
                <span className="text-muted-foreground font-normal leading-snug">
                  These cookies help to improve the performance of the website.
                </span>
              </Label>
              <Switch id="performance" />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Save preferences
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
