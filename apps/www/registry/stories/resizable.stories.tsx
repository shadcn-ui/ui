import type { Meta, StoryObj } from "@storybook/react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/default/ui/resizable"

/**
 * Accessible resizable panel groups and layouts with keyboard support.
 */
const meta: Meta<typeof ResizablePanelGroup> = {
  title: "ui/ResizablePanelGroup",
  component: ResizablePanelGroup,
  tags: ["autodocs"],
  argTypes: {
    onLayout: {
      control: false,
    },
  },
  args: {
    className: "max-w-96 rounded-lg border",
    direction: "horizontal",
  },
  render: (args) => (
    <ResizablePanelGroup {...args}>
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
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

/**
 * The default form of the resizable panel group.
 */
export const Default: Story = {}
