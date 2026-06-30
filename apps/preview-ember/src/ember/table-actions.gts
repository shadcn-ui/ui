import MoreHorizontalIcon from '~icons/ms/more_horiz';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ember-ui/table';

const products = [
  { name: 'Wireless Mouse', price: '$29.99' },
  { name: 'Mechanical Keyboard', price: '$129.99' },
  { name: 'USB-C Hub', price: '$49.99' },
];

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Product</TableHead>
        <TableHead>Price</TableHead>
        <TableHead @class="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {{#each products as |product|}}
        <TableRow>
          <TableCell @class="font-medium">{{product.name}}</TableCell>
          <TableCell>{{product.price}}</TableCell>
          <TableCell @class="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button @variant="ghost" @size="icon" @class="size-8">
                  <MoreHorizontalIcon />
                  <span class="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent @align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      {{/each}}
    </TableBody>
  </Table>
</template>
