<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table"
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Task</TableHead>
        <TableHead>Assignee</TableHead>
        <TableHead>Status</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">
          Design homepage
        </TableCell>
        <TableCell>
          <Select default-value="sarah">
            <SelectTrigger class="w-40" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sarah">
                  Sarah Chen
                </SelectItem>
                <SelectItem value="marcus">
                  Marc Rodriguez
                </SelectItem>
                <SelectItem value="emily">
                  Emily Watson
                </SelectItem>
                <SelectItem value="david">
                  David Kim
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>In Progress</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          Implement API
        </TableCell>
        <TableCell>
          <Select default-value="marcus">
            <SelectTrigger class="w-40" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sarah">
                  Sarah Chen
                </SelectItem>
                <SelectItem value="marcus">
                  Marc Rodriguez
                </SelectItem>
                <SelectItem value="emily">
                  Emily Watson
                </SelectItem>
                <SelectItem value="david">
                  David Kim
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>Pending</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          Write tests
        </TableCell>
        <TableCell>
          <Select default-value="emily">
            <SelectTrigger class="w-40" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="sarah">
                  Sarah Chen
                </SelectItem>
                <SelectItem value="marcus">
                  Marc Rodriguez
                </SelectItem>
                <SelectItem value="emily">
                  Emily Watson
                </SelectItem>
                <SelectItem value="david">
                  David Kim
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell>Not Started</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
