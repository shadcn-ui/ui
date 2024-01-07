import { toast } from "sonner"
import { z } from "zod"

import { Selector } from "@/registry/default/ui/selector"

const users = [
  {
    id: 1,
    name: "John",
    surname: "Doe",
    age: 20,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    location: "London",
  },
  {
    id: 2,
    name: "Jane",
    surname: "Smith",
    age: 25,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    location: "London",
  },
  {
    id: 3,
    name: "Alicia",
    surname: "Koch",
    age: 28,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    location: "Berlin",
  },
  {
    id: 4,
    name: "Olivia",
    surname: "Martin",
    age: 32,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    location: "Paris",
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

export default function SelectorSearchDemo() {
  return (
    <Selector
      data={users}
      valueAccessor={(user) => user.id}
      onSelectChange={({ added, removed }) => {
        toast(
          `${added ? "Selected" : "Unselected"} ${(added ?? removed)!.name}`,
          {
            description: JSON.stringify(added ?? removed, null, 2),
          }
        )
      }}
      renderValue={(user) => `${user.name} ${user.surname}`}
      placeholder="Select a user"
      search={{
        accessor: ({ name, surname, location }) => [name, surname, location],
      }}
    />
  )
}
