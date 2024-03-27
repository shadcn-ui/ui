import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  CircleUser,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react"

import { BreadcrumbList } from "@/registry/default/ui/breadcrumb"
import { CardDescription } from "@/registry/default/ui/card"
import { TabsContent } from "@/registry/default/ui/tabs"
import { Badge } from "@/registry/new-york/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/registry/new-york/ui/breadcrumb"
import { Button } from "@/registry/new-york/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import { Input } from "@/registry/new-york/ui/input"
import { Label } from "@/registry/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"
import { Textarea } from "@/registry/new-york/ui/textarea"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export const description =
  "A settings page. The settings page has a sidebar navigation and a main content area. The main content area has a form to update the store name and a form to update the plugins directory. The sidebar navigation has links to general, security, integrations, support, organizations, and advanced settings."

export const iframeHeight = "835px"

export const containerClassName = "w-full h-full"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-muted w-full flex-col">
      <aside className="w-14 bg-background fixed inset-y-0 left-0 border-r z-10">
        <nav className="flex flex-col items-center h-full gap-6 py-6 px-2">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg bg-primary text-primary-foreground font-semibold md:text-base h-8 w-8 group justify-center rounded-full shrink-0"
          >
            <Package2 className="h-4 w-4 group-hover:scale-110 transition-all" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-muted-foreground flex justify-center transition-colors hover:text-foreground"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-muted-foreground flex justify-center transition-colors hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-foreground flex justify-center transition-colors hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                <span className="sr-only">Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-muted-foreground flex justify-center transition-colors hover:text-foreground"
              >
                <Users2 className="h-5 w-5" />
                <span className="sr-only">Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-muted-foreground flex justify-center transition-colors hover:text-foreground"
              >
                <LineChart className="h-5 w-5" />
                <span className="sr-only">Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="text-muted-foreground mt-auto flex justify-center transition-colors hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6 bg-muted/40 pl-20 md:pl-20">
        <div className="flex items-center">
          <Breadcrumb className="flex-1">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Gamer Gear Pro Controller</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background rounded-lg"
                />
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-background"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="flex-1 auto-rows-max max-w-5xl mx-auto grid gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="w-7 h-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="text-xl font-semibold tracking-tight">
              Gamer Gear Pro Controller
              <Badge variant="outline" className="ml-2">
                In stock
              </Badge>
            </h1>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="col-span-2 grid items-start auto-rows-max gap-4 md:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        defaultValue="Gamer Gear Pro Controller"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Stock</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">SKU</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead className="w-[100px]">Size</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-001
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="100" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="99.99" />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="s"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-002
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="143" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="99.99" />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="m"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-semibold">
                          GGPC-003
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="32" />
                        </TableCell>
                        <TableCell>
                          <Input type="number" defaultValue="99.99" />
                        </TableCell>
                        <TableCell>
                          <ToggleGroup
                            type="single"
                            defaultValue="s"
                            variant="outline"
                          >
                            <ToggleGroupItem value="s">S</ToggleGroupItem>
                            <ToggleGroupItem value="m">M</ToggleGroupItem>
                            <ToggleGroupItem value="l">L</ToggleGroupItem>
                          </ToggleGroup>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t justify-center p-4">
                  <Button size="sm" variant="ghost" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Variant
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="electronics">
                            Electronics
                          </SelectItem>
                          <SelectItem value="accessories">
                            Accessories
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="subcategory">
                        Subcategory (optional)
                      </Label>
                      <Select>
                        <SelectTrigger id="subcategory">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="t-shirts">T-Shirts</SelectItem>
                          <SelectItem value="hoodies">Hoodies</SelectItem>
                          <SelectItem value="sweatshirts">
                            Sweatshirts
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:gap-8 items-start auto-rows-max">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-3">
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="300"
                          src="/placeholder.svg"
                          width="300"
                        />
                      </div>
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <button>
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="84"
                          src="/placeholder.svg"
                          width="84"
                        />
                      </button>
                      <label
                        htmlFor="upload"
                        className="w-full aspect-square border border-dashed rounded-md flex items-center justify-center"
                      >
                        <Input id="upload" type="file" className="sr-only" />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-destructive text-destructive">
                <CardHeader>
                  <CardTitle>Archive Product</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div></div>
                  <Button size="sm" variant="destructive">
                    Archive Product
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
