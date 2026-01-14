import { Input } from "@/examples/base/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/examples/base/ui/table"

export function TableWithInput() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Wireless Mouse</TableCell>
          <TableCell>
            <Input
              type="number"
              defaultValue="1"
              className="h-8 w-20"
              min="0"
            />
          </TableCell>
          <TableCell>$29.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Mechanical Keyboard</TableCell>
          <TableCell>
            <Input
              type="number"
              defaultValue="2"
              className="h-8 w-20"
              min="0"
            />
          </TableCell>
          <TableCell>$129.99</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">USB-C Hub</TableCell>
          <TableCell>
            <Input
              type="number"
              defaultValue="1"
              className="h-8 w-20"
              min="0"
            />
          </TableCell>
          <TableCell>$49.99</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
