import { faPaperclip,faFaceSmile,faSmile,faLink,faCode,faAt } from '@fortawesome/free-solid-svg-icons';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/tui/ui/card"
import { Textarea } from "@/registry/tui/ui/textarea"

export function CardsTextArea() {
  const assignList=[
    {label:"UnAssigned",image:""},
    {label:"Wade Cooper1",image:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"},
    {label:"Wade Cooper",image:"https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
  ]
  const labelList=[
    {label:"UnLabelled"},
    {label:"Engineering"},
    {label:"Marketing"}
  ]
  const dueDateList=[
    {label:"No Due Date"},
    {label:"Today"},
    {label:"Tomorrow"}
  ]

  const IconButton =  [
    { bg: "red-500", label: "Excited",icon:"fire-regular" },
    { bg: "pink-500", label: "Loved",icon:"circle-heart-regular" },
    { bg: "green-400", label: "Happy",icon:"face-smile-regular" },
    { bg: "yellow-400", label: "Sad",icon:"face-worried-regular" },
    { bg: "blue-500", label: "Thumbsy",icon:"thumbs-up-regular" },
    { bg: "transparent", label: "I feel nothing",icon:"" }
  ]
  
  return (
    <div className="grid gap-2 sm:grid-cols-1 xl:grid-cols-1">
      <Card className="">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-normal text-primary">Text Area</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="text-m font-bold text-primary">Simple</div>
        <Textarea  label=" Add your comment"/>

        <div className="text-m mt-3 font-bold text-primary">With underline and actions</div>
        <Textarea placeholder="Add your comment..." iconButton={IconButton} color="indigo" iconStyle='h-5 w-5 text-gray-400' attachIcon='paperclip-solid' submitButtonName="Post" icon="face-smile-beam-solid"  variant="outline" showMoodButton="resultButton"   textareavariant="default" showIconForTextArea={true} image="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>

        <div className="text-m mt-3 font-bold text-primary">With preview button</div>
        <Textarea placeholder="Add your comment..." iconStyle='h-5 w-5 text-gray-400' color="indigo" icons={["link-simple-solid","code-solid","at-solid"]} submitButton="Post" showMoodButton="default" writeButton='Write' previewContent="Preview Content Will be here...."  previewButton='Preview'/>

        <div className="text-m mt-3 font-bold text-primary">With underline and actions</div>
        <Textarea placeholder="Add your comment..." iconStyle='h-5 w-5 text-gray-400' color="indigo"  attachIcon='paperclip-solid' icon="face-smile-beam-solid" submitButtonName="Post" iconButton={IconButton}  showIconForTextArea={true}  image="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"/>

        <div className="text-m font-bold text-primary">With title and pill actions</div>
        <Textarea placeholder="Add your comment..." iconStyle='h-5 w-5 text-gray-400' color="indigo"  hasDivider={true} titlePlaceholder="Title" assignButtonName='Assign' icon="circle-user-regular" labelButtonName="Label" assignList={assignList} createButton='Create' labelList={labelList} dueDateButtonName="Due Date" dueDateList={dueDateList} attachFileName="Attach File" attachIcon='paperclip-solid' textareavariant="borderForInput"/>

        </CardContent>

       
      </Card>
    </div>
  )
}
