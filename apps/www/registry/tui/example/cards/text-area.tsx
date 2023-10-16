
import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { ButtonList, Textarea } from "@/registry/tui/ui/textarea"
import profile from '../../assest/profile.webp';

export function CardsTextArea() {
  const assignList = [
    { label: "UnAssigned", image: "" },
    { label: "Wade Cooper1", image: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
    { label: "Wade Cooper", image: "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
  ]
  const labelList = [
    { label: "UnLabelled" },
    { label: "Engineering" },
    { label: "Marketing" }
  ]
  const dueDateList = [
    { label: "No Due Date" },
    { label: "Today" },
    { label: "Tomorrow" }
  ]

  const IconButton:ButtonList[] = [
    { bg: "bg-red-500", label: "Excited", icon: "fire-regular", height: "h-8", width: "w-8" },
    { bg: "bg-pink-600", label: "Loved", icon: "circle-heart-regular", height: "h-8", width: "w-8" },
    { bg: "bg-green-400", label: "Happy", icon: "face-smile-regular", height: "h-8", width: "w-8" },
    { bg: "bg-yellow-400", label: "Sad", icon: "face-worried-regular", height: "h-8", width: "w-8" },
    { bg: "bg-blue-500", label: "Thumbsy", icon: "thumbs-up-regular", height: "h-8", width: "w-8" },
    { bg: "bg-transparent", label: "I feel nothing" }
  ]
  const profileImageUrl = profile.src;
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-primary">Text Area</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-m font-bold text-primary">Simple</div>
        <Textarea label=" Add your comment" />

        <div className="text-m mt-3 font-bold text-primary">With avatar and actions</div>
        <Textarea placeholder="Add your comment..." iconList={IconButton}  icon="face-smile-beam-solid" attachIcon='paperclip-solid'  buttonText="Post" textareavariant="default" showIconListForTextArea={true} imageSrc={profileImageUrl} textColor="indigo" />

        <div className="text-m mt-3 font-bold text-primary">With preview button</div>
        <Textarea placeholder="Add your comment..."  icons={["link-simple-solid", "code-solid", "at-solid"]} submitButton="Post" showMoodButton="default" firstButtonText='Write' buttonContent="Preview Content Will be here...." secondButtonText='Preview' textColor="indigo" />

        <div className="text-m mt-3 font-bold text-primary">With underline and actions</div>
        <Textarea placeholder="Add your comment..."  attachIcon='paperclip-solid' icon="face-smile-beam-solid" buttonText="Post" iconList={IconButton} showIconListForTextArea={true} imageSrc={profileImageUrl} textColor="indigo" />

        <div className="text-m font-bold text-primary">With title and pill actions</div>
        <Textarea placeholder="Add your comment..."  hasDivider={true} titlePlaceholder="Title" assignButtonName='Assign' icon="circle-user-regular" labelButtonName="Label" assignList={assignList} createButton='Create' labelList={labelList} dueDateButtonName="Due Date" dueDateList={dueDateList} dividerText="Attach File" attachIcon='paperclip-solid' textareavariant="borderForInput" textColor="indigo" />

      </CardContent>


    </Card>
  )
}
