import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/registry/default/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/registry/default/ui/form"
import { Selector } from "@/registry/default/ui/selector"

const users = [
  {
    id: 1,
    name: "John",
    surname: "Doe",
    age: 20,
    address: "123 Main Street",
    phoneNumber: 1234567890,
  },
  {
    id: 2,
    name: "Jane",
    surname: "Smith",
    age: 25,
    address: "123 Main Street",
    phoneNumber: 1234567890,
  },
  {
    id: 3,
    name: "Alicia",
    surname: "Koch",
    age: 28,
    address: "123 Main Street",
    phoneNumber: 1234567890,
  },
  {
    id: 4,
    name: "Olivia",
    surname: "Martin",
    age: 32,
    address: "123 Main Street",
    phoneNumber: 1234567890,
  },
]

const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
  age: z.number(),
  address: z.string(),
  phoneNumber: z.number(),
})

const schema = z.object({
  user: userSchema,
})

type Schema = z.infer<typeof schema>

export default function SelectorFormDemo() {
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = (data: Schema) => {
    toast(JSON.stringify({ data }, null, 2))
  }

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Selector
                  data={users}
                  valueAccessor={(user) => user.id}
                  onSelectChange={({ added }) => {
                    field.onChange(added)
                  }}
                  renderValue={(user) => `${user.name} ${user.surname}`}
                  placeholder="Select a user"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={!form.formState.isValid} type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}
