import { FormsDemo } from "@/components/forms-demo"

export default function FormsPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-12 p-4 lg:flex-row">
      <div className="">
        <FormsDemo />
      </div>
      <div className="theme-scaled">
        <FormsDemo />
      </div>
    </div>
  )
}
