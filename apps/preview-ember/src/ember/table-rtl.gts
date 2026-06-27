import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ember-ui/table';

const invoices = [
  {
    invoice: 'INV001',
    paymentStatus: 'مدفوع',
    totalAmount: '$250.00',
    paymentMethod: 'بطاقة ائتمانية',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'قيد الانتظار',
    totalAmount: '$150.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'غير مدفوع',
    totalAmount: '$350.00',
    paymentMethod: 'تحويل بنكي',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'مدفوع',
    totalAmount: '$450.00',
    paymentMethod: 'بطاقة ائتمانية',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'مدفوع',
    totalAmount: '$550.00',
    paymentMethod: 'PayPal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'قيد الانتظار',
    totalAmount: '$200.00',
    paymentMethod: 'تحويل بنكي',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'غير مدفوع',
    totalAmount: '$300.00',
    paymentMethod: 'بطاقة ائتمانية',
  },
];

<template>
  <Table dir="rtl">
    <TableCaption>قائمة بفواتيرك الأخيرة.</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead @class="w-[100px]">الفاتورة</TableHead>
        <TableHead>الحالة</TableHead>
        <TableHead>الطريقة</TableHead>
        <TableHead @class="text-right">المبلغ</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {{#each invoices as |invoice|}}
        <TableRow>
          <TableCell @class="font-medium">{{invoice.invoice}}</TableCell>
          <TableCell>{{invoice.paymentStatus}}</TableCell>
          <TableCell>{{invoice.paymentMethod}}</TableCell>
          <TableCell @class="text-right">{{invoice.totalAmount}}</TableCell>
        </TableRow>
      {{/each}}
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colspan="3">المجموع</TableCell>
        <TableCell @class="text-right">$2,500.00</TableCell>
      </TableRow>
    </TableFooter>
  </Table>
</template>
