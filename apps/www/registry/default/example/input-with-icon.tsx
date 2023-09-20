import { Input } from "@/registry/default/ui/input"
import { Mail, RotateCw, Search, User } from "lucide-react"

export default function InputWithIcon() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <Input type="text" icon={<Search size={20} />} placeholder="Search..." />
        <Input type="email" icon={<Mail size={20} />} iconPosition="right" placeholder="Email" />
      </div>

      <div className="flex gap-3">
        <Input type="text" icon={<User size={20} />} iconPosition="left" placeholder="Your Name" />
        <Input type="text" icon={<RotateCw size={20} className="animate-spin" />} iconPosition="right" />
      </div>
    </div>
  )
}
