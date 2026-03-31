<script setup lang="ts">
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
        <TableHead>Name</TableHead>
        <TableHead>Email</TableHead>
        <TableHead class="text-right">
          Role
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">
          Sarah Chen
        </TableCell>
        <TableCell>sarah.chen@acme.com</TableCell>
        <TableCell class="text-right">
          Admin
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          Marc Rodriguez
        </TableCell>
        <TableCell>marcus.rodriguez@acme.com</TableCell>
        <TableCell class="text-right">
          User
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          Emily Watson
        </TableCell>
        <TableCell>emily.watson@acme.com</TableCell>
        <TableCell class="text-right">
          User
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
