import { Tabs, TabsList, TabsTrigger } from "@/examples/react-aria/ui/tabs"
import { AppWindowIcon, CodeIcon } from "lucide-react"

export function TabsIcons() {
  return (
    <Tabs defaultSelectedKey="preview">
      <TabsList>
        <TabsTrigger id="preview">
          <AppWindowIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger id="code">
          <CodeIcon />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
