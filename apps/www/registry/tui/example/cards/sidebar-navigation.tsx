import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { SideBarNavigation } from "@/registry/tui/ui/sidebar-navigation";

export function CardsSidebarNavigation() {
    const items = [
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
    const teams = [
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
                <SideBarNavigation items={items} teams={teams} hasIconAndBadge={true} color="gray" backgroundColor="text-red-500 bg-indigo-700 text-white red" teamName="Your Team" userName="Tim Cook" logoImage="https://tailwindui.com/img/logos/mark.svg?color=white" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">Dark</div>
                <SideBarNavigation items={items} teams={teams} hasIconAndBadge={true} userName="Tim Cook" backgroundColor="bg-gray-900 text-white" teamName="Your Team" logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">Light</div>
                <SideBarNavigation items={items} teams={teams} hasIconAndBadge={true} userName="Tim Cook" teamName="Your Team" color="gray" logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">With expandable sections</div>
                <SideBarNavigation items={items} iconPrefix={true} userName="Tim Cook" color="gray" logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

                <div className="text-m mt-2 font-bold text-primary">With secondary navigation</div>
                <SideBarNavigation items={items} iconSuffix={true} userName="Tim Cook" color="gray" logoImage="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" imageURL="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" />

            </CardContent>

        </Card>
    )
}