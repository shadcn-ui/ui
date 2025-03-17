"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/registry/new-york/ui/button"
import {
  Editable,
  EditableArea,
  EditableCancel,
  EditableInput,
  EditableLabel,
  EditablePreview,
  EditableSubmit,
  EditableToolbar,
  EditableTrigger,
} from "@/registry/new-york/ui/editable"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/registry/new-york/ui/form"

const formSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
})

type FormValues = z.infer<typeof formSchema>

export default function EditableFormDemo() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Rodney Mullen",
      title: "Skateboarder",
    },
  })

  const onSubmit = React.useCallback((input: FormValues) => {
    toast.success(
      <pre className="w-full">{JSON.stringify(input, null, 2)}</pre>
    )
  }, [])

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-2 rounded-md border p-4 shadow-sm"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editable
                  defaultValue={field.value}
                  onSubmit={field.onChange}
                  invalid={!!form.formState.errors.name}
                >
                  <FormLabel asChild>
                    <EditableLabel>Name</EditableLabel>
                  </FormLabel>
                  <div className="flex items-start gap-4">
                    <EditableArea className="flex-1">
                      <EditablePreview />
                      <EditableInput />
                    </EditableArea>
                    <EditableTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Edit
                      </Button>
                    </EditableTrigger>
                  </div>
                  <EditableToolbar>
                    <EditableSubmit asChild>
                      <Button type="button" size="sm">
                        Save
                      </Button>
                    </EditableSubmit>
                    <EditableCancel asChild>
                      <Button type="button" variant="outline" size="sm">
                        Cancel
                      </Button>
                    </EditableCancel>
                  </EditableToolbar>
                  <FormMessage />
                </Editable>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Editable
                  defaultValue={field.value}
                  onSubmit={field.onChange}
                  invalid={!!form.formState.errors.title}
                >
                  <FormLabel asChild>
                    <EditableLabel>Title</EditableLabel>
                  </FormLabel>
                  <div className="flex items-start gap-4">
                    <EditableArea className="flex-1">
                      <EditablePreview />
                      <EditableInput />
                    </EditableArea>
                    <EditableTrigger asChild>
                      <Button type="button" variant="outline" size="sm">
                        Edit
                      </Button>
                    </EditableTrigger>
                  </div>
                  <EditableToolbar>
                    <EditableSubmit asChild>
                      <Button type="button" size="sm">
                        Save
                      </Button>
                    </EditableSubmit>
                    <EditableCancel asChild>
                      <Button type="button" variant="outline" size="sm">
                        Cancel
                      </Button>
                    </EditableCancel>
                  </EditableToolbar>
                  <FormMessage />
                </Editable>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex w-fit gap-2 self-end">
          <Button type="submit" className="w-full">
            Update
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
