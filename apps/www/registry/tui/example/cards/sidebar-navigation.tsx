import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { SideBarNavigation } from "@/registry/tui/ui/sidebar-navigation";

export function CardsSidebarNavigation() {
    const firstItems = [
        { href: '/link1', icon: "house-regular", text: 'Dashboard', badgeCount: 5, },
        {href: '/link2', icon: "user-regular", text: 'Team'},
        {href: '/link3', icon: "folder-regular", text: 'Project', badgeCount: 12 },
        { href: '/link4', icon: "calendar-days-regular", text: 'Calendar', badgeCount: 20, },
        { href: '/link5', icon: "file-regular", text: 'Document', },
        { href: '/link6', icon: "chart-pie-regular", text: 'Reports' },
    ];
    const secondItems = [
        { href: '/link1', text: 'Dashboard', badgeCount: 5, },
        {
            href: '/link2', text: 'Team', subMenuItems: [
                { name: "Heroicons" },
                { name: "Tailwind Labs" },
                { name: "Customer Success" },
            ]
        },
        {
            href: '/link3', text: 'Project', badgeCount: 12,
            subMenuItems: [
                { name: "GraphQL API" },
                { name: "iOS App" },
                { name: "Android App" },
                { name: "New Customer Portal" }
            ]
        },
        { href: '/link4', text: 'Calendar', badgeCount: 20, },
        { href: '/link5', text: 'Document', },
        { href: '/link6', text: 'Reports' },
    ];

    const thirdItems = [
        { href: '/link1', icon: "house-regular", text: 'Dashboard', badgeCount: 5, },
        {
            href: '/link2', icon: "user-regular", text: 'Team', subMenuItems: [
                { name: "Heroicons" },
                { name: "Tailwind Labs" },
                { name: "Customer Success" },
            ]
        },
        {
            href: '/link3', icon: "folder-regular", text: 'Project', badgeCount: 12,
            subMenuItems: [
                { name: "GraphQL API" },
                { name: "iOS App" },
                { name: "Android App" },
                { name: "New Customer Portal" }
            ]
        },
        { href: '/link4', icon: "calendar-days-regular", text: 'Calendar', badgeCount: 20, },
        { href: '/link5', icon: "file-regular", text: 'Document', },
        { href: '/link6', icon: "chart-pie-regular", text: 'Reports' },
    ];
    const itemList = [
        { icon: 'H', name: 'Heroicons' },
        { icon: 'T', name: 'Tailwind Labs' },
        { icon: 'W', name: 'Workcation' },
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal text-primary">Sidebar Navigation</CardTitle>
            </CardHeader>
            <CardContent>

                <div className="text-m font-bold text-primary">Brand</div>
                <SideBarNavigation items={firstItems} itemList={itemList} hasIconAndBadge={true} alignIcon="right" iconStyle="h-5 w-5" className="text-white" backgroundColor="indigo" anchorVariant="primary" textItem="Your Team" userName="Tim Cook" logoImage="https://tailwindui.com/img/logos/mark.svg?color=white" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">Dark</div>
                <SideBarNavigation items={firstItems} itemList={itemList} hasIconAndBadge={true} textColor="gray" backgroundColor="gray" className="hover:text-white" anchorVariant="accent" alignIcon="right" iconStyle="h-5 w-5"  userName="Tim Cook"  textItem="Your Team" logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">Light</div>
                <SideBarNavigation items={firstItems} itemList={itemList} hasIconAndBadge={true} anchorVariant="soft" alignIcon="right" iconStyle="h-5 w-5"  userName="Tim Cook" textItem="Your Team"  logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">With expandable sections</div>
                <SideBarNavigation items={secondItems}  userName="Tim Cook" anchorVariant="ghost" alignIcon="right" iconStyle="h-5 w-5"  logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">With secondary navigation</div>
                <SideBarNavigation items={thirdItems}  userName="Tim Cook" anchorVariant="ghost" alignIcon="left" iconStyle="h-5 w-5"  logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

            </CardContent>

        </Card>
    )
}