<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@saaze/ui'
</script>

<template>
  <Table>
    <TableCaption>فهرست اعضای تیم</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>نام</TableHead>
        <TableHead>وضعیت</TableHead>
        <TableHead class="text-end">نقش</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>سارا احمدی</TableCell>
        <TableCell>فعال</TableCell>
        <TableCell class="text-end">مدیر</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>علی رضایی</TableCell>
        <TableCell>در انتظار</TableCell>
        <TableCell class="text-end">ویرایشگر</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
