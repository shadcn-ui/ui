import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/examples/base/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/examples/base/ui/table"

const people = [
  { value: "sarah", label: "Sarah Chen" },
  { value: "marcus", label: "Marc Rodriguez" },
  { value: "emily", label: "Emily Watson" },
  { value: "david", label: "David Kim" },
]

const tasks = [
  {
    task: "Design homepage",
    assignee: "sarah",
    status: "In Progress",
  },
  {
    task: "Implement API",
    assignee: "marcus",
    status: "Pending",
  },
  {
    task: "Write tests",
    assignee: "emily",
    status: "Not Started",
  },
]

export function TableWithSelect() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Task</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((item) => (
          <TableRow key={item.task}>
            <TableCell className="font-medium">{item.task}</TableCell>
            <TableCell>
              <Select
                items={people}
                defaultValue={people.find(
                  (person) => person.value === item.assignee
                )}
                itemToStringValue={(item) => {
                  return item.value
                }}
              >
                <SelectTrigger className="w-40" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {people.map((person) => (
                      <SelectItem key={person.value} value={person}>
                        {person.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{item.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
