import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../registry/new-york-v4/ui/form"
import { Input } from "../registry/new-york-v4/ui/input"

function FormPreview() {
  const form = useForm<{ email: string }>({
    defaultValues: { email: "" },
  })

  return (
    <Form {...form}>
      <form className="w-full max-w-sm">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

const meta = {
  title: "Shadcn/Components/Form",
  component: Form,
  tags: ["autodocs"],
  render: () => <FormPreview />,
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
