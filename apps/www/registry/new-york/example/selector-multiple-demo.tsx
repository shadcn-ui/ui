import { Selector } from "@/registry/new-york/ui/selector";
import { toast } from "sonner";

const users = [
  {
    id: 1,
    name: 'John',
    surname: 'Doe',
    age: 20,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
  {
    id: 2,
    name: 'Jane',
    surname: 'Smith',
    age: 25,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
  {
    id: 3,
    name: 'Alicia',
    surname: 'Koch',
    age: 28,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
  {
    id: 4,
    name: 'Olivia',
    surname: 'Martin',
    age: 32,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
]

export default function SelectorSingleDemo(){

  return <Selector
  mode="multiple"
  data={users}
  valueAccessor={user=> user.id}
  onSelectChange={({added, removed})=>{
      toast(`${added ? "Selected" : "Unselected"} ${(added ?? removed)!.name}`,{
        description: JSON.stringify(added ?? removed, null, 2)
      })
  }}
  renderLabel={(users)=> users.map(user=> `${user.name} ${user.surname}`).join(", ")}
  placeholder="Select some users"
  />
}
