<script setup lang="ts">
import ChevronDown from "@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?component"
import LifeBuoy from "@material-symbols/svg-400/rounded/help.svg?component"
import Send from "@material-symbols/svg-400/rounded/send.svg?component"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <Sidebar>
      <SidebarContent>
        <Collapsible default-open class="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel
              as-child
              class="text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                Help
                <ChevronDown class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <LifeBuoy />
                      Support
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Send />
                      Feedback
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
    </Sidebar>
  </SidebarProvider>
</template>
