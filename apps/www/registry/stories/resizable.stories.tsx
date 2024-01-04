import { Meta, StoryObj } from "@storybook/react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/default/ui/resizable"

const meta: Meta<typeof ResizablePanelGroup> = {
  title: "ui/ResizablePanelGroup",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  argTypes: {},
}
export default meta

type Story = StoryObj<typeof ResizablePanelGroup>

export const Base: Story = {
  render: (args) => (
    <ResizablePanelGroup
      {...args}
      direction="horizontal"
      className="max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  args: {},
}
