import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/examples/base/ui/table"

export function TableWithBadges() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Priority</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Design homepage</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
              Completed
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
              High
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Implement API</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
              In Progress
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">
              Medium
            </span>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Write tests</TableCell>
          <TableCell>
            <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">
              Pending
            </span>
          </TableCell>
          <TableCell className="text-right">
            <span className="inline-flex items-center rounded-full bg-gray-500/10 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-400">
              Low
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
