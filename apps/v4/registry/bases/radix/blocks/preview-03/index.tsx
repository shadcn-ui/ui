import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/bases/radix/ui/resizable"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from "@/registry/bases/radix/ui/sidebar"

import { PromptInput } from "./prompt-input"
import { SidebarHistory } from "./sidebar-history"
import { SidebarMainNav } from "./sidebar-main-nav"
import {
  SidebarSearch,
  type SidebarSearchCommandData,
  type SidebarSearchProjectChats,
} from "./sidebar-search"
import { SidebarUserNav, type SidebarUserNavUser } from "./sidebar-user-nav"

const chatsByProject: SidebarSearchProjectChats[] = [
  {
    projectId: "ui",
    projectName: "shadcn/ui",
    chats: [
      { id: "s1", title: "CLI init preset UX" },
      { id: "s2", title: "v4 dashboard examples" },
      { id: "s3", title: "Field + InputGroup demos" },
      { id: "s4", title: "Style Rhea typography scale" },
      { id: "s5", title: "Registry JSON schema tweaks" },
    ],
  },
  {
    projectId: "new-website",
    projectName: "vercel/new-website",
    chats: [
      { id: "u1", title: "Preview blocks capture grid" },
      { id: "u2", title: "Icon bundle generation script" },
      { id: "u3", title: "Command palette shortcuts" },
      { id: "u4", title: "Base vs Radix block parity notes" },
      { id: "u5", title: "Regression: SidebarMenu keyboard focus" },
    ],
  },
  {
    projectId: "docs",
    projectName: "shadcn/docs",
    chats: [
      { id: "d1", title: "Sidebar pattern inventory" },
      { id: "d2", title: "Dark mode typography audit" },
      { id: "d3", title: "Search + command palette copy" },
    ],
  },
]

const sidebarCommandData = {
  recentChats: [
    { id: "r1", title: "Refactor registry parity checks" },
    { id: "r2", title: "Sidebar inset layout questions" },
    { id: "r3", title: "Combobox branching UX" },
    { id: "r4", title: "Dropdown trigger with InputGroupButton" },
    { id: "r5", title: "Palette tokens for muted surfaces" },
  ],
  chatsByProject,
} satisfies SidebarSearchCommandData

const sidebarFooterUser = {
  name: "shadcn",
  email: "m@shadcn.com",
  avatar: "/avatars/shadcn.jpg",
} satisfies SidebarUserNavUser

export default function Preview03Example() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarSearch commandData={sidebarCommandData} />
          <SidebarMainNav />
        </SidebarHeader>
        <SidebarContent>
          <SidebarHistory chatsByProject={chatsByProject} />
        </SidebarContent>
        <SidebarFooter>
          <SidebarUserNav user={sidebarFooterUser} />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize={550} minSize={500} maxSize={700}>
            <div className="flex h-full flex-col">
              <div className="flex-1" />
              <div className="p-4">
                <PromptInput />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="70%">here</ResizablePanel>
        </ResizablePanelGroup>
      </SidebarInset>
    </SidebarProvider>
  )
}
