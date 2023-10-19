import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/tui/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/tui/ui/tabs'
import React from 'react'


interface TabsWithUnderlineProps {
  showTitle?: boolean;
  withIcons?: boolean;
  fullWidth?: boolean;
  withBar?: boolean;
  withBadge?: boolean
}

export const TabsWithUnderline = ({ showTitle, withIcons, fullWidth, withBar, withBadge }: TabsWithUnderlineProps) => {
  return (
    <>
      <CardHeader>
        {showTitle && <CardTitle>Tabs</CardTitle>}
        <CardDescription>
          {withBar && "Bar with underline"} {!withBar && "Tabs with underline"} {withIcons && "and icons"} {fullWidth && "(full width)"} {withBadge && "and badges"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList variant={withBar ? "bar" : "underline"} className={fullWidth ? "w-full" : ""}>
            <TabsTrigger
              variant={withBar ? "bar" : "underline"}
              value="profile"
              icon={withIcons ? "user-solid" : undefined}
              badge={withBadge ? "52" : undefined}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              variant={withBar ? "bar" : "underline"}
              value="property" icon={withIcons ? "building-solid" : undefined}
              badge={withBadge ? "50" : undefined}
            >
              Property
            </TabsTrigger>
            <TabsTrigger
              variant={withBar ? "bar" : "underline"}
              value="agents" icon={withIcons ? "users-solid" : undefined}
              badge={withBadge ? "4" : undefined}
            >
              Agents
            </TabsTrigger >
            <TabsTrigger
              variant={withBar ? "bar" : "underline"}
              value="transactions" icon={withIcons ? "credit-card-alt-solid" : undefined}
              badge={withBadge ? "0" : undefined}
            >
              Transactions
            </TabsTrigger>
            <TabsTrigger
              variant={withBar ? "bar" : "underline"}
              value="account"
              icon={withIcons ? "user-solid" : undefined}
              badge={withBadge ? "52" : undefined}
            >
              My Account
            </TabsTrigger>
            <TabsTrigger
              tabIndex={6}
              variant={withBar ? "bar" : "underline"}
              value="company" icon={withIcons ? "building-solid" : undefined}
              badge={withBadge ? "50" : undefined}
            >
              Company
            </TabsTrigger>
            <TabsTrigger
              tabIndex={7}
              variant={withBar ? "bar" : "underline"}
              value="teamMembers" icon={withIcons ? "users-solid" : undefined}
              badge={withBadge ? "4" : undefined}
            >
              Team Members
            </TabsTrigger >
            <TabsTrigger
              tabIndex={8}
              variant={withBar ? "bar" : "underline"}
              value="billing" icon={withIcons ? "credit-card-alt-solid" : undefined}
              badge={withBadge ? "0" : undefined}
            >
              Billing
            </TabsTrigger>
          </TabsList >
          {/* <TabsContent value="account">Make changes to your account here.</TabsContent> */}
          {/* <TabsContent value="company">Make changes to your company here.</TabsContent> */}
          {/* <TabsContent value="teamMembers">Change your teamMembers here.</TabsContent> */}
          {/* <TabsContent value="billing">Change your billing here.</TabsContent> */}
        </Tabs >
      </CardContent >
      <hr />
    </>
  )
}

export const SimpleTab = () => {
  const triggerClassName = '"bg-gray-900 p-0 pl-1 data-[state=active]:shadow-none data-[state=active]:bg-gray-900 data-[state=active]:text-primary shadow-none ring-0"'
  return (
    <>
      <CardHeader>
        <CardDescription>
          Simple on dark
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-fit items-center rounded-b-md bg-gray-900 py-10">
        <Tabs defaultValue="account" className='mt-3'>
          <TabsList className="flex w-full justify-start space-x-6 rounded-none border-b-2 border-gray-800 bg-gray-900 p-0 pb-6 shadow-none">
            <TabsTrigger
              className={triggerClassName} value="account"> My Account </TabsTrigger>
            <TabsTrigger value="company" className={triggerClassName}> Company </TabsTrigger>
            <TabsTrigger value="teamMembers" className={triggerClassName}>  Team Members </TabsTrigger >
            <TabsTrigger className={triggerClassName} value="billing">Billing</TabsTrigger>
          </TabsList >
          {/* <TabsContent value="account">Make changes to your account here.</TabsContent> */}
          {/* <TabsContent value="company">Make changes to your company here.</TabsContent> */}
          {/* <TabsContent value="teamMembers">Change your teamMembers here.</TabsContent> */}
          {/* <TabsContent value="billing">Change your billing here.</TabsContent> */}
        </Tabs >
      </CardContent >
      <hr />
    </>
  )
}

interface TabsInPillsProps {
  withIcons?: boolean;
  withGrayBg?: boolean;
  withBrandColor?: boolean
}

export const TabsInPills = ({ withIcons, withGrayBg, withBrandColor }: TabsInPillsProps) => {
  const tabsTriggerClassName = withBrandColor ?
    "data-[state=active]:text-primary data-[state=active]:bg-primary-foreground"
    : withGrayBg ? "data-[state=active]:bg-muted dark:text-muted dark:data-[state=active]:text-foreground"
      : "data-[state=active]:bg-muted";
  return (
    <>
      <CardHeader>
        <CardDescription>
          Tabs in pills {withIcons && "with icons"} {withGrayBg && "on gray"} {withBrandColor && "with brand color"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="account">
          <TabsList className={withGrayBg ? "flex h-24 w-full justify-start bg-gray-50 bg-opacity-[75%] pl-2" : "bg-background"}>
            <TabsTrigger value="account" icon={withIcons ? "user-solid" : undefined} className={tabsTriggerClassName}>
              My Account
            </TabsTrigger>
            <TabsTrigger value="company" icon={withIcons ? "building-solid" : undefined} className={tabsTriggerClassName}>Company</TabsTrigger>
            <TabsTrigger value="teamMembers" icon={withIcons ? "users-solid" : undefined} className={tabsTriggerClassName}>Team Members</TabsTrigger>
            <TabsTrigger value="billing" icon={withIcons ? "credit-card-alt-solid" : undefined} className={tabsTriggerClassName}>Billing</TabsTrigger>
          </TabsList>
          {/* <TabsContent value="account">Make changes to your account here.</TabsContent> */}
          {/* <TabsContent value="company">Make changes to your company here.</TabsContent> */}
          {/* <TabsContent value="teamMembers">Change your teamMembers here.</TabsContent> */}
          {/* <TabsContent value="billing">Change your billing here.</TabsContent> */}
        </Tabs>
      </CardContent>
      <hr />
    </>
  )
}

const TabsCard = () => {
  return (
    <Card className='p-0'>
      <TabsWithUnderline showTitle />
      <TabsWithUnderline withIcons />
      <TabsInPills />
      <TabsInPills withIcons />
      <TabsInPills withGrayBg />
      <TabsInPills withBrandColor />
      <TabsWithUnderline fullWidth />
      <TabsWithUnderline withBar />
      <TabsWithUnderline withBadge />
      <SimpleTab />
    </Card >
  )
}

export default TabsCard
