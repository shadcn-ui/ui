import { Badge } from "@/examples/base/ui/badge"

export function BadgeCustomColors() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-600 text-blue-50 dark:bg-blue-600 dark:text-blue-50">
        Blue
      </Badge>
      <Badge className="bg-green-600 text-green-50 dark:bg-green-600 dark:text-green-50">
        Green
      </Badge>
      <Badge className="bg-sky-600 text-sky-50 dark:bg-sky-600 dark:text-sky-50">
        Sky
      </Badge>
      <Badge className="bg-purple-600 text-purple-50 dark:bg-purple-600 dark:text-purple-50">
        Purple
      </Badge>
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Blue
      </Badge>
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Green
      </Badge>
      <Badge className="bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
        Sky
      </Badge>
      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        Purple
      </Badge>
      <Badge className="bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
        Red
      </Badge>
    </div>
  )
}
