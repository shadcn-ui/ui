<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/ui/item"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Basic Item">
    <ItemGroup class="w-full max-w-md">
      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="UserIcon"
            tabler="IconUser"
            hugeicons="User02Icon"
            phosphor="UserIcon"
            remixicon="RiUserLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>John Doe</ItemTitle>
          <ItemDescription>Software Engineer</ItemDescription>
        </ItemContent>
      </Item>

      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="MailIcon"
            tabler="IconMail"
            hugeicons="Mail01Icon"
            phosphor="EnvelopeIcon"
            remixicon="RiMailLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Email Notifications</ItemTitle>
          <ItemDescription>Receive email updates about your account</ItemDescription>
        </ItemContent>
      </Item>

      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="BellIcon"
            tabler="IconBell"
            hugeicons="Notification02Icon"
            phosphor="BellIcon"
            remixicon="RiNotification3Line"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Push Notifications</ItemTitle>
          <ItemDescription>Receive push notifications on your device</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  </Example>
</template>
