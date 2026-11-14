import {
  CircleCheckIcon,
  CircleIcon,
  ListChecksIcon,
  ListTodoIcon,
} from "lucide-react"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

const todos = [
  { title: "Write the migration guide", done: true },
  { title: "Add a changeset", done: true },
  { title: "Fix the focus ring on the select trigger", done: false },
  { title: "Update the registry snapshots", done: false },
  { title: "Add tests for the combobox", done: false },
]

function TodoLine({ todo }: { todo: (typeof todos)[number] }) {
  return (
    <TraceLine>
      <TraceIcon>{todo.done ? <CircleCheckIcon /> : <CircleIcon />}</TraceIcon>
      <TraceTitle>{todo.title}</TraceTitle>
    </TraceLine>
  )
}

export function QueueBasic() {
  const pending = todos.filter((todo) => !todo.done)
  const completed = todos.filter((todo) => todo.done)

  return (
    <Trace className="max-w-sm">
      <TraceCollapsible defaultExpanded>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListTodoIcon />
            </TraceIcon>
            <TraceTitle>{pending.length} to do</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {pending.map((todo) => (
              <TodoLine key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <ListChecksIcon />
            </TraceIcon>
            <TraceTitle>{completed.length} completed</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {completed.map((todo) => (
              <TodoLine key={todo.title} todo={todo} />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}
