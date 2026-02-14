import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Hello World</p>
    </div>
  )
}
