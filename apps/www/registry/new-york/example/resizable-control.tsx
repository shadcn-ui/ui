import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable"
import { useRef } from "react"
import { Button } from "@/registry/new-york/ui/button"
import { ImperativePanelHandle } from "react-resizable-panels"

export default function ResizableDemo() {
    const leftPanelRef = useRef<ImperativePanelHandle>(null)

    const toggleLeftPanel = () => {
        if (leftPanelRef.current) {
            if (leftPanelRef.current.isCollapsed()) {
                leftPanelRef.current.expand()
            } else {
                leftPanelRef.current.collapse()
            }
        }
    }

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border md:min-w-[450px]"
        >
            <ResizablePanel>
                <div className="flex h-[200px] items-center justify-center p-6">
                    <Button onClick={toggleLeftPanel}>
                        Toggle Left Panel
                    </Button>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel
                defaultSize={50}
                collapsible={true}
                ref={leftPanelRef}
            >
                <div className="flex h-[200px] items-center justify-center p-6">
                    Left Resizable Panel
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}