import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from "@/registry/new-york-v4/ui/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip";
import {
  Bold,
  Italic,
  Underline,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export function ToolbarDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Toolbar aria-label="Text formatting options">
        <ToolbarGroup>
          <ToolbarButton variant="outline" size="icon-sm" aria-label="Bold">
            <Bold />
          </ToolbarButton>
          <ToolbarButton variant="outline" size="icon-sm" aria-label="Italic">
            <Italic />
          </ToolbarButton>
          <ToolbarButton
            variant="outline"
            size="icon-sm"
            aria-label="Underline"
          >
            <Underline />
          </ToolbarButton>
        </ToolbarGroup>
        <ToolbarSeparator />
        <ToolbarGroup>
          <ToolbarButton variant="outline" size="icon-sm" aria-label="Undo">
            <Undo />
          </ToolbarButton>
          <ToolbarButton variant="outline" size="icon-sm" aria-label="Redo">
            <Redo />
          </ToolbarButton>
        </ToolbarGroup>
      </Toolbar>

      <Toolbar orientation="vertical" aria-label="Editor options">
        <ToolbarToggleGroup type="multiple" variant="outline">
          <ToolbarToggleItem value="bold" aria-label="Bold">
            <Bold />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="italic" aria-label="Italic">
            <Italic />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="underline" aria-label="Underline">
            <Underline />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarToggleGroup
          type="single"
          defaultValue="center"
          variant="outline"
        >
          <ToolbarToggleItem value="left" aria-label="Left aligned">
            <AlignLeft />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="center" aria-label="Center aligned">
            <AlignCenter />
          </ToolbarToggleItem>
          <ToolbarToggleItem value="right" aria-label="Right aligned">
            <AlignRight />
          </ToolbarToggleItem>
        </ToolbarToggleGroup>
      </Toolbar>

      <TooltipProvider>
        <Toolbar aria-label="Mac-like dock" size="default">
          <ToolbarGroup className="flex items-end gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <ToolbarButton aria-label="Home" size="icon" variant="ghost">
                  <Bold />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToolbarButton aria-label="Search" size="icon" variant="ghost">
                  <Italic />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarGroup>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToolbarButton
                  aria-label="Settings"
                  size="icon"
                  variant="ghost"
                >
                  <Underline />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </ToolbarGroup>
        </Toolbar>
      </TooltipProvider>
    </div>
  );
}

