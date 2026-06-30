<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox } from '@/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table'

const tableData = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@example.com',
    role: 'User',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'User',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Editor',
  },
]

const selectedRows = ref<Set<string>>(new Set(['1']))

const selectAll = ref(false)

function handleSelectAll(checked: boolean) {
  if (checked) {
    selectedRows.value = new Set(tableData.map((row) => row.id))
  } else {
    selectedRows.value = new Set()
  }
  selectAll.value = checked
}

function handleSelectRow(id: string, checked: boolean) {
  const newSelected = new Set(selectedRows.value)
  if (checked) {
    newSelected.add(id)
  } else {
    newSelected.delete(id)
  }
  selectedRows.value = newSelected
  selectAll.value = newSelected.size === tableData.length
}
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead class="w-8">
          <Checkbox
            id="select-all-checkbox"
            name="select-all-checkbox"
            :checked="selectAll"
            @checked-change="handleSelectAll"
          />
        </TableHead>
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead>Role</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-for="row in tableData"
        :key="row.id"
        :data-state="selectedRows.has(row.id) ? 'selected' : undefined"
      >
        <TableCell>
          <Checkbox
            :id="`row-${row.id}-checkbox`"
            :name="`row-${row.id}-checkbox`"
            :checked="selectedRows.has(row.id)"
            @checked-change="(checked: boolean) => handleSelectRow(row.id, checked)"
          />
        </TableCell>
        <TableCell class="font-medium">{{ row.name }}</TableCell>
        <TableCell>{{ row.email }}</TableCell>
        <TableCell>{{ row.role }}</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
