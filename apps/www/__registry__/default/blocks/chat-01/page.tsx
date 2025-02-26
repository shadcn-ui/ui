import { ChatSection } from "@/registry/default/blocks/chat-01/components/chat-section"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-2xl">
        <ChatSection />
      </div>
    </div>
  )
}
