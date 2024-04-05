import { Metadata } from "next"
import Image from "next/image"
import { ChatLayout } from "./components/chat-layout"
import { cookies } from "next/headers"

export const metadata: Metadata = {
  title: "Chat",
  description: "Chat interface built using the components.",
}

export default function ChatPage() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/chat-light.png"
          width={1280}
          height={843}
          alt="chat"
          className="block dark:hidden"
        />
        <Image
          src="/examples/chat-dark.png"
          width={1280}
          height={843}
          alt="Chat"
          className="hidden dark:block"
        />
      </div>
      <div className="relative hidden h-[800px] md:grid ">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
      </div>
    </>
  )
}
