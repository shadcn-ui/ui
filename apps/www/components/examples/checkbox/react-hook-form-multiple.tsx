"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const items = [
  {
    id: "recents",
    label: "Recents",
  },
  {
    id: "home",
    label: "Home",
  },
  {
    id: "applications",
    label: "Applications",
  },
  {
    id: "desktop",
    label: "Desktop",
  },
  {
    id: "downloads",
    label: "Downloads",
  },
  {
    id: "documents",
    label: "Documents",
  },
] as const

const FormSchema = z
  .object({
    recents: z.boolean().optional(),
    home: z.boolean().optional(),
    applications: z.boolean().optional(),
    desktop: z.boolean().optional(),
    downloads: z.boolean().optional(),
    documents: z.boolean().optional(),
  })
  .refine((_items) => {
    const x = Object.values(_items).some(Boolean)
    console.log("x", x)
    return x
  }, "You have to select at least one item.")

type Items = z.infer<typeof FormSchema>

const prettifyRenderedItems = (obj: Items) => ({
  items: Object.entries(obj).reduce(
    (acc, [item, selected]) => (selected ? [...acc, item] : acc),
    [] as string[]
  ),
})

export function CheckboxReactHookFormMultiple() {
  const { register, handleSubmit } = useForm<Items>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      recents: true,
      home: false,
      applications: false,
      desktop: false,
      downloads: false,
      documents: false,
    },
  })

  function onSubmit(data: Items) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">
            {JSON.stringify(prettifyRenderedItems(data), null, 2)}
          </code>
        </pre>
      ),
    })
  }

  console.log("re-render")

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label className="text-base">Sidebar</Label>
        <p className="text-sm text-muted-foreground">
          Select the items you want to display in the sidebar.
        </p>
      </div>
      <div className="mb-8 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <Checkbox
              id={item.id}
              {...register(item.id)}
              defaultChecked={item.id === "recents"}
            />
            <Label htmlFor={item.id} className="font-normal">
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
