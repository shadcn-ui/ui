import { Input } from "@/registry/radix-nova/ui/input"

export default function InputDemo() {
  return (
    <div className="flex min-h-screen w-full items-start justify-center p-6 pt-12">
      <div className="flex max-w-md flex-col flex-wrap gap-4 md:flex-row">
        <Input type="email" placeholder="Email" />
        <Input type="text" placeholder="Error" aria-invalid="true" />
        <Input type="password" placeholder="Password" />
        <Input type="number" placeholder="Number" />
        <Input type="file" placeholder="File" />
        <Input type="tel" placeholder="Tel" />
        <Input type="text" placeholder="Text" />
        <Input type="url" placeholder="URL" />
        <Input type="search" placeholder="Search" />
        <Input type="date" placeholder="Date" />
        <Input type="datetime-local" placeholder="Datetime Local" />
        <Input type="month" placeholder="Month" />
        <Input type="time" placeholder="Time" />
        <Input type="week" placeholder="Week" />
        <Input disabled placeholder="Disabled" />
      </div>
    </div>
  )
}
