import { AddTaskForm } from "@/registry/new-york/blocks/app-01/components/add-task-form"
import { TasksList } from "@/registry/new-york/blocks/app-01/components/tasks-list"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/new-york/ui/card"

export default function AppPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Add Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TasksList />
        </CardContent>
        <CardFooter>
          <AddTaskForm />
        </CardFooter>
      </Card>
    </div>
  )
}
