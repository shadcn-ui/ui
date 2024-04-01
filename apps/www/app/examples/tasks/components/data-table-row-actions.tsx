"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Currency, Product, ProductStatus, ProductUnit } from "@prisma/client"
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row, Table } from "@tanstack/react-table"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/new-york/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"
import { Input } from "@/registry/new-york/ui/input"
import { Switch } from "@/registry/new-york/ui/switch"
import { Textarea } from "@/registry/new-york/ui/textarea"

import { CreateProductForm, productSchema } from "./createProductForm"

// import { Product, productSchema } from "../data/schema"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  table: Table<Product>
}

export function DataTableRowActions<TData>({
  row,
  table,
}: DataTableRowActionsProps<TData>) {
  const [open, setOpen] = React.useState(false)
  const [product, setProduct] = useState<Product | undefined>(undefined)
  useEffect(() => {
    const getProduct = async () => {
      //@ts-ignore
      const product = await fetch(`/api/product?productId=${row.original.id}`)

      setProduct((await product.json()).product)
    }
    getProduct()
  }, [])

  const [priceWithoutTax, setPriceWithoutTax] = useState<number | undefined>(
    undefined
  )
  const [taxRate, setTaxRate] = useState<number | undefined>(undefined)

  const [taxAmount, setTaxAmount] = useState<number | undefined>(undefined)

  const [priceWithTax, setPriceWithTax] = useState<number | undefined>(
    undefined
  )

  useEffect(() => {
    setTaxAmount(
      taxRate && priceWithoutTax
        ? Math.round((taxRate / 100) * priceWithoutTax * 100) / 100
        : undefined
    )
  }, [taxRate, priceWithoutTax])

  useEffect(() => {
    setPriceWithTax(taxAmount ? priceWithoutTax! + taxAmount : undefined)
  }, [taxAmount])

  function onPriceWithoutTaxChange(value: string) {
    if (value) {
      setPriceWithoutTax(Number(value))
    }
  }

  function onTaxRateChange(value: string) {
    if (value) {
      setTaxRate(Number(value))
    }
  }

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {},
  })

  async function onSubmit(values: z.infer<typeof productSchema>) {
    values.priceWithTax = priceWithTax
    values.taxAmount = taxAmount
    //@ts-ignore
    values.id = row.original.id

    await fetch("api/product", {
      method: "PATCH",
      body: JSON.stringify(values),
    })
    const products = await fetch(`/api/products`)
    //@ts-ignore
    table.options.meta?.setProducts((await products.json()).products)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <span>Update</span>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuSeparator />

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              console.log({ myrow: row })
              await fetch("api/product", {
                method: "delete",
                //@ts-ignore
                body: JSON.stringify({ id: row.original.id }),
              })
              const products = await fetch(`/api/products`)

              //@ts-ignore
              table.options.meta?.setProducts((await products.json()).products)

              //setProducts((await products.json()).products)
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogContent className="max-w-4xl">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-4 rounded-lg border p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="type your product name..."
                        {...field}
                        defaultValue={product?.name}
                        onChangeCapture={(event) => {
                          console.log(event.currentTarget.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="describe your product..."
                        className="resize-none"
                        {...field}
                        defaultValue={product?.description ?? undefined}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between space-x-2 rounded-lg border p-4">
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="priceWithoutTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price without tax</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChangeCapture={(event) =>
                            onPriceWithoutTaxChange(event.currentTarget.value)
                          }
                          defaultValue={product?.priceWithoutTax ?? undefined}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="taxRate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax rate</FormLabel>

                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChangeCapture={(event) =>
                            onTaxRateChange(event.currentTarget.value)
                          }
                          defaultValue={product?.taxRate ?? undefined}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="taxAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax amount</FormLabel>
                      <FormDescription>
                        Will be calculated automatically based on your price
                        without tax and your tax rate
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          readOnly
                          defaultValue={product?.taxAmount ?? undefined}
                          value={taxAmount}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceWithTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price with taxe</FormLabel>
                      <FormDescription>
                        Will be calculated automatically based on your price
                        without tax and your tax rate
                      </FormDescription>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          readOnly
                          defaultValue={product?.priceWithTax ?? undefined}
                          value={priceWithTax}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="hidden"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hide product</FormLabel>
                    <FormDescription>
                      If hidden, wont appear by default in your products list
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      defaultChecked={product?.hidden}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex  justify-between rounded-lg border p-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <div className="relative w-max">
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-[200px] appearance-none font-normal"
                          )}
                          {...field}
                        >
                          <option></option>
                          {Object.values(ProductStatus).map((v) => (
                            <option
                              value={v}
                              selected={v === product?.status}
                              key={v}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <div className="relative w-max">
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-[200px] appearance-none font-normal"
                          )}
                          {...field}
                        >
                          <option></option>
                          {Object.values(Currency).map((v) => (
                            <option
                              value={v}
                              key={v}
                              selected={v === product?.currency}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <div className="relative w-max">
                      <FormControl>
                        <select
                          className={cn(
                            buttonVariants({ variant: "outline" }),
                            "w-[200px] appearance-none font-normal"
                          )}
                          {...field}
                        >
                          <option></option>
                          {Object.values(ProductUnit).map((v) => (
                            <option
                              value={v}
                              selected={v === product?.unit}
                              key={v}
                            >
                              {v}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <ChevronDownIcon className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Update product</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
