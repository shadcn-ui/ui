import { useToast } from "@/registry/default/ui//use-toast";
import { Selector } from "@/registry/default/ui/selector";

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
    surname: 'Doe',
    age: 25,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
  {
    id: 3,
    name: 'John',
    surname: 'Smith',
    age: 28,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
  {
    id: 4,
    name: 'Jane',
    surname: 'Smith',
    age: 32,
    address: '123 Main Street',
    phoneNumber: 1234567890,
  },
]

export default function SelectorSingleDemo(){
  const {toast} = useToast();
  return <Selector
  mode="single"
  data={users}
  valueAccessor={user=> user.id}
  onSelectChange={({added, removed})=>{
    toast({
      title: `${added ? "Selected" : "Unselected"} ${(added ?? removed)!.name}`,
      description: JSON.stringify(added ?? removed, null, 2)
    })
  }}
  renderValue={(user)=> `${user.name} ${user.surname}`}
  placeholder="Select a user"
  />
}
