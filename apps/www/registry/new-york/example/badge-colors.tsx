import { Badge } from "@/registry/new-york/ui/badge"

export default function BadgeColors() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col space-y-2">
        <Badge variant="gray">gray</Badge>
        <Badge variant="blue">blue</Badge>
        <Badge variant="purple">purple</Badge>
        <Badge variant="amber">amber</Badge>
        <Badge variant="red">red</Badge>
        <Badge variant="pink">pink</Badge>
        <Badge variant="green">green</Badge>
        <Badge variant="teal">teal</Badge>
      </div>
      <div className="flex flex-col space-y-2">
        <Badge variant="gray-subtle">gray-subtle</Badge>
        <Badge variant="blue-subtle">blue-subtle</Badge>
        <Badge variant="purple-subtle">purple-subtle</Badge>
        <Badge variant="amber-subtle">amber-subtle</Badge>
        <Badge variant="red-subtle">red-subtle</Badge>
        <Badge variant="pink-subtle">pink-subtle</Badge>
        <Badge variant="green-subtle">green-subtle</Badge>
        <Badge variant="teal-subtle">teal-subtle</Badge>
      </div>
    </div>
  )
}
