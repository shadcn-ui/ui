import { Input } from "@/styles/radix-force-ui/ui/input"

export function InputVariants() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Input variant="outline" placeholder="Outline" />
      <Input variant="filled" placeholder="Filled" />
      <Input variant="underline" placeholder="Underline" />
      <Input variant="ghost" placeholder="Ghost" />
    </div>
  )
}
