"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  mobile: z.boolean().default(false).optional(),
})

export function CheckboxReactHookFormSingle() {
  const { register, handleSubmit } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      mobile: false,
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
        <Checkbox {...register("mobile")} />
        <div className="space-y-1 leading-none">
          <Label>Use different settings for my mobile devices</Label>
          <p className="text-sm text-muted-foreground">
            You can manage your mobile notifications in the{" "}
            <Link href="/examples/forms">mobile settings</Link> page.
          </p>
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}
