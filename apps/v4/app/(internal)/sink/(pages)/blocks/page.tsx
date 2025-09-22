import { NotionPromptForm } from "./notion-prompt-form"

export default function BlocksPage() {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="bg-muted/50 flex min-h-[500px] max-w-md flex-1 flex-col rounded-3xl p-2 [--radius:1.2rem]">
        <div className="mt-auto flex flex-col gap-2">
          <NotionPromptForm />
        </div>
      </div>
    </div>
  )
}
