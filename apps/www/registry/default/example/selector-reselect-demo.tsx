import { Plus } from "lucide-react"
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

export default function SelectorReselectDemo() {
  return (
    <Selector
      mode="multiple"
      data={users}
      valueAccessor={(user) => user.id}
      onSelectedClick="reselect"
      onSelectChange={({ added }) => {
        toast(`Selected ${added.name}`, {
          description: JSON.stringify(added, null, 2),
        })
      }}
      renderLabel={() => "Add users"}
      renderSelectedIcon={() => <></>}
      renderValue={(user) => (
        <div className="flex cursor-pointer gap-2">
          <Plus /> {`${user.name} ${user.surname}`}
        </div>
      )}
      placeholder="Add users"
    />
  )
}
