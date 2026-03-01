import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <p>Hello World</p>
    </div>
  )
}
