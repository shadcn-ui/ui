import { toast } from "sonner"

import { Selector } from "@/registry/default/ui/selector"

const users = [
  {
    id: 1,
    name: "John",
    surname: "Doe",
    age: 20,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    city: "London",
  },
  {
    id: 2,
    name: "Jane",
    surname: "Smith",
    age: 25,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    city: "London",
  },
  {
    id: 3,
    name: "Alicia",
    surname: "Koch",
    age: 28,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    city: "Paris",
  },
  {
    id: 4,
    name: "Olivia",
    surname: "Martin",
    age: 32,
    address: "123 Main Street",
    phoneNumber: 1234567890,
    city: "Berlin",
  },
]

export default function SelectorFiltersDemo() {
  return (
    <Selector
      data={users}
      valueAccessor={(user) => user.id}
      onSelectChange={({ added, removed }) => {
        toast(`${added ? "Selected" : "Unselected"}`, {
          description: JSON.stringify(added ?? removed, null, 2),
        })
      }}
      renderValue={(user) => `${user.name} ${user.surname}`}
      filters={[
        {
          label: "In London",
          filter: (user) => user.city === "London",
        },
        {
          label: "Above 24",
          filter: (user) => user.age > 24,
          defaultEnabled: true,
        },
      ]}
      placeholder="Select some users"
    />
  )
}
