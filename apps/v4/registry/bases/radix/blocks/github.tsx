import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/radix/ui/tabs"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function GithubBlock() {
  return (
    <ExampleWrapper>
      <CodeCard />
    </ExampleWrapper>
  )
}

function CodeCard() {
  return (
    <Example title="Code Card">
      <Card className="w-full max-w-xs [--padding:--spacing(4)]">
        <CardContent>
          <Tabs defaultValue="local">
            <TabsList className="w-full">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="codespaces">Codespaces</TabsTrigger>
            </TabsList>
            <TabsContent value="local">
              <Item size="sm" className="px-0">
                <ItemMedia variant="icon">
                  <IconPlaceholder
                    lucide="InfoIcon"
                    tabler="IconInfoCircle"
                    hugeicons="AlertCircleIcon"
                  />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Clone</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <IconPlaceholder
                    lucide="InfoIcon"
                    tabler="IconInfoCircle"
                    hugeicons="AlertCircleIcon"
                    className="size-4"
                  />
                </ItemActions>
              </Item>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Example>
  )
}
