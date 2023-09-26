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
                <Tabs defaultValue="account">
                    <TabsList variant={withBar ? "bar" : "underline"} className={cn(fullWidth ? "w-full" : "", withBadge && "pl-6")}>
                        <TabsTrigger
                            variant={withBar ? "bar" : "underline"}
                            value="account"
                            icon={withIcons ? "user-solid" : undefined}
                            badge={withBadge ? "52" : undefined}
                        >
                            My Account
                        </TabsTrigger>
                        <TabsTrigger
                            variant={withBar ? "bar" : "underline"}
                            value="company" icon={withIcons ? "building-solid" : undefined}
                            badge={withBadge ? "50" : undefined}
                        >
                            Company
                        </TabsTrigger>
                        <TabsTrigger
                            variant={withBar ? "bar" : "underline"}
                            value="teamMembers" icon={withIcons ? "users-solid" : undefined}
                            badge={withBadge ? "4" : undefined}
                        >
                            Team Members
                        </TabsTrigger >
                        <TabsTrigger
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
            <CardContent className="bg-gray-900 flex items-center h-fit py-10 rounded-b-md">
                <Tabs defaultValue="account" className='mt-3'>
                    <TabsList className="w-full p-0 pb-6 space-x-6 flex justify-start bg-gray-900 shadow-none border-b-2 border-gray-800 rounded-none">
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
                    <TabsList className={withGrayBg ? "bg-gray-50 bg-opacity-[75%] h-24 pl-2 w-full flex justify-start" : "bg-background"}>
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