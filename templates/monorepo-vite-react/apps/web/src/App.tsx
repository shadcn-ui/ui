import { useState } from "react"
import "./App.css"
import { Button } from "@workspace/ui/components/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Count is {count}</h1>
        <Button size="sm" onClick={() => setCount((count) => count + 1)}>
          button
        </Button>
      </div>
    </div>
  )
}

export default App
