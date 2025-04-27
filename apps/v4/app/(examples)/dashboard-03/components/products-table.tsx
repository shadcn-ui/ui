import {
  ArrowUpDownIcon,
  EllipsisVerticalIcon,
  ListFilterIcon,
  PlusIcon,
} from "lucide-react"

import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/new-york-v4/ui/card"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/new-york-v4/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york-v4/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/registry/new-york-v4/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"

export function ProductsTable({
  products,
}: {
  products: {
    id: string
    name: string
    price: number
    stock: number
    dateAdded: string
    status: string
  }[]
}) {
  return (
    <Card className="flex w-full flex-col gap-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <Tabs defaultValue="all">
          <TabsList className="w-full @3xl/page:w-fit">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="in-stock">In Stock</TabsTrigger>
            <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
            <TabsTrigger value="add-product" asChild>
              <button>
                <PlusIcon />
              </button>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="hidden items-center gap-2 **:data-[slot=button]:size-8 **:data-[slot=select-trigger]:h-8 @3xl/page:flex">
          <Select defaultValue="all">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Category:</span>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="low-stock">Low Stock</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Price:</span>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">$100-$200</SelectItem>
              <SelectItem value="in-stock">$200-$300</SelectItem>
              <SelectItem value="low-stock">$300-$400</SelectItem>
              <SelectItem value="archived">$400-$500</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger>
              <span className="text-muted-foreground text-sm">Status:</span>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">In Stock</SelectItem>
              <SelectItem value="in-stock">Low Stock</SelectItem>
              <SelectItem value="low-stock">Archived</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <ListFilterIcon />
          </Button>
          <Button variant="outline" size="icon">
            <ArrowUpDownIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 px-4">
                <Checkbox />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:py-2.5">
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="px-4">
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-right">
                  ${product.price.toFixed(2)}
                </TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      product.status === "Low Stock"
                        ? "border-orange-700 bg-transparent text-orange-700 dark:border-orange-700 dark:bg-transparent dark:text-orange-700"
                        : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-100"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(product.dateAdded).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-6">
                        <EllipsisVerticalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-between border-t pt-6 @3xl/page:flex-row">
        <div className="text-muted-foreground hidden text-sm @3xl/page:block">
          Showing 1-10 of 100 products
        </div>
        <Pagination className="mx-0 w-fit">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  )
}
