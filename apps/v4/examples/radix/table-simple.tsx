import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/examples/radix/ui/table"

export function TableSimple() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead className="text-right">Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Sarah Chen</TableCell>
          <TableCell>sarah.chen@acme.com</TableCell>
          <TableCell className="text-right">Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Marc Rodriguez</TableCell>
          <TableCell>marcus.rodriguez@acme.com</TableCell>
          <TableCell className="text-right">User</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Emily Watson</TableCell>
          <TableCell>emily.watson@acme.com</TableCell>
          <TableCell className="text-right">User</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
