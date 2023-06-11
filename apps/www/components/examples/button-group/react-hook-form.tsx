"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group"
import { toast } from "@/components/ui/use-toast"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/react-hook-form/form"

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
})

export function ButtonGroupReactHookForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      type: "all"
    }
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="block">Notify me about...</FormLabel>
              <FormControl>
                <ButtonGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormItem>
                    <FormControl>
                      <ButtonGroupItem value="all">All</ButtonGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ButtonGroupItem value="mentions">Mentions</ButtonGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ButtonGroupItem value="none">None</ButtonGroupItem>
                    </FormControl>
                  </FormItem>
                </ButtonGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
