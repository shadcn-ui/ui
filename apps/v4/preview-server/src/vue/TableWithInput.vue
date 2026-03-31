<script setup lang="ts">
import { Input } from "@/ui/input"
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
        <TableHead>Product</TableHead>
        <TableHead>Quantity</TableHead>
        <TableHead>Price</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell class="font-medium">
          Wireless Mouse
        </TableCell>
        <TableCell>
          <Input
            type="number"
            default-value="1"
            class="h-8 w-20"
            :min="0"
          />
        </TableCell>
        <TableCell>$29.99</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          Mechanical Keyboard
        </TableCell>
        <TableCell>
          <Input
            type="number"
            default-value="2"
            class="h-8 w-20"
            :min="0"
          />
        </TableCell>
        <TableCell>$129.99</TableCell>
      </TableRow>
      <TableRow>
        <TableCell class="font-medium">
          USB-C Hub
        </TableCell>
        <TableCell>
          <Input
            type="number"
            default-value="1"
            class="h-8 w-20"
            :min="0"
          />
        </TableCell>
        <TableCell>$49.99</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
