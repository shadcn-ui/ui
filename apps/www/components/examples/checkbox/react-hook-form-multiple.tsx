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

const FormSchema = z.object({
  recents: z.boolean().default(false).optional(),
  home: z.boolean().default(false).optional(),
  applications: z.boolean().default(false).optional(),
  desktop: z.boolean().default(false).optional(),
  downloads: z.boolean().default(false).optional(),
  documents: z.boolean().default(false).optional(),
})

export function CheckboxReactHookFormMultiple() {
  const { register, handleSubmit } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      recents: false,
      home: false,
      applications: false,
      desktop: false,
      downloads: false,
      documents: false,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

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
            <Checkbox id={item.id} {...register(item.id)} />
            <Label className="font-normal" htmlFor={item.id}>
              {item.label}
            </Label>
          </div>
        ))}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
