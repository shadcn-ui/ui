import Content from "./tabs-content.svelte"
import List, {
  tabsListVariants,
  type TabsListVariant,
} from "./tabs-list.svelte"
import Trigger from "./tabs-trigger.svelte"
import Root from "./tabs.svelte"

export {
  Root,
  Content,
  List,
  Trigger,
  tabsListVariants,
  type TabsListVariant,
  //
  Root as Tabs,
  Content as TabsContent,
  List as TabsList,
  Trigger as TabsTrigger,
}
