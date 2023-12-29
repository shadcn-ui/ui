import { useToast } from "@/registry/default/ui//use-toast"
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

export default function SelectorSingleDemo() {
  const { toast } = useToast()
  return (
    <Selector
      mode="multiple"
      data={users}
      valueAccessor={(user) => user.id}
      onSelectChange={({ added, removed }) => {
        toast({
          title: `${added ? "Selected" : "Unselected"}`,
          description: JSON.stringify(added ?? removed, null, 2),
        })
      }}
      renderValue={(user) => `${user.name} ${user.surname}`}
      renderLabel={(users) =>
        users.map((user) => `${user.name} ${user.surname}`).join(", ")
      }
      placeholder="Select some users"
    />
  )
}
