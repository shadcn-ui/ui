"use client"

import React, { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Currency, Product, ProductStatus, ProductUnit } from "@prisma/client"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { PlusCircle } from "lucide-react"
import { useFormState } from "react-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/registry/new-york/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
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
import { Label } from "@/registry/new-york/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/new-york/ui/select"
import { Switch } from "@/registry/new-york/ui/switch"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { toast } from "@/registry/new-york/ui/use-toast"
import { createProduct } from "@/app/lib/actions"
import { SubmitButton } from "@/app/sharedComponents/submitButton"
import { ActionResult } from "@/app/sharedTypes"

interface CreateProductForm {
  setProducts?: (products: Product[]) => {}
}

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string({ required_error: "cannot be empty" }),
  description: z.string().optional().nullable(),
  priceWithoutTax: z.coerce.number().optional(),
  taxRate: z.coerce.number().optional(),
  taxAmount: z.coerce.number().optional(),
  priceWithTax: z.coerce.number().optional(),
  status: z.nativeEnum(ProductStatus).optional().nullable(),
  currency: z.nativeEnum(Currency).optional().nullable(),
  unit: z.nativeEnum(ProductUnit).optional().nullable(),
  hidden: z.boolean().default(false),
})

export function CreateProductForm({ setProducts }: CreateProductForm) {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {},
  })

  const [open, setOpen] = React.useState(false)

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

  async function onSubmit(values: z.infer<typeof productSchema>) {
    values.priceWithTax = priceWithTax
    values.taxAmount = taxAmount

    await fetch("api/product", { method: "post", body: JSON.stringify(values) })
    const products = await fetch(`/api/products`)

    setProducts((await products.json()).products)
    setOpen(false)
  }

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

  const [result, action] = useFormState<ActionResult | undefined, FormData>(
    createProduct,
    undefined
  )

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button type="button" asChild>
          <DialogTrigger>
            <div className="flex items-center space-x-2">
              <p className="font-bold">New product </p>
              <PlusCircle className="h-6 w-6" />
            </div>
          </DialogTrigger>
        </Button>
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
                        checked={field.value}
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
                              <option value={v} key={v}>
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
                              <option value={v} key={v}>
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
                              <option value={v} key={v}>
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

              <Button type="submit">Create product</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
