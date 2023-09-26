import { CardDescription } from '@/registry/default/ui/card'
import { Button } from '@/registry/tui/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/registry/tui/ui/card'
import { Icon, IconType } from '@/registry/tui/ui/icon'
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/tui/ui/popover'
import Image from 'next/image'
import React from 'react'

interface DataWithDesc {
    name: string;
    description: string;
    href: string;
    icon?: IconType
}

interface Data {
    name: string;
    href: string;
    icon: IconType
}


export const StackedWithFooterAction = () => {
    const solutions: DataWithDesc[] = [
        { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: "pie-chart-duotone" },
        { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: "i-cursor-duotone" },
        { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: "fingerprint-solid" },
        { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: "plus-square-solid" },
        { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: "refresh-solid" },
    ]
    const callsToAction: Data[] = [
        { name: 'Watch demo', href: '#', icon: "play-circle-solid" },
        { name: 'Contact sales', href: '#', icon: "phone-alt-solid" },
    ]
    return (
        <CardContent className='w-full h-[36rem]'>
            <CardHeader>
                <CardTitle>
                    Flyout Menus
                </CardTitle>
                <CardDescription>
                    Stacked with footer actions
                </CardDescription>
            </CardHeader>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='flex justify-center w-full'>
                        <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                            Solutions
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="z-10 flex shadow-none border-none w-screen max-w-max px-4">
                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                            {solutions.map((item: DataWithDesc) => (
                                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <Icon name={item?.icon || "check-circle-solid"} className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <a href={item.href} className="font-semibold text-gray-900">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </a>
                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 w-full p-0 bottom-0">
                            {callsToAction.map((item: Data) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                >
                                    <Icon name={item?.icon} className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                    {item.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </CardContent>
    )
}
export const TwoColumn = () => {
    const solutions: DataWithDesc[] = [
        { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: "pie-chart-solid" },
        {
            name: 'Integrations',
            description: 'Connect with third-party tools and find out expectations',
            href: '#',
            icon: "plus-square-solid",
        },
        {
            name: 'Engagement',
            description: 'Speak directly to your customers with our engagement tool',
            href: '#',
            icon: "i-cursor-duotone",
        },
        { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: "arrow-pointer-solid" },
        { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: "fingerprint-solid" },
        {
            name: 'Reports',
            description: 'Edit, manage and create newly informed decisions',
            href: '#',
            icon: "bar-chart-solid",
        },
    ]
    return (
        <CardContent className='w-full h-[36rem]'>
            <CardHeader>
                <CardDescription>
                    Two-column
                </CardDescription>
            </CardHeader>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='flex justify-center w-full'>
                        <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                            Solutions
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="z-10 flex shadow-none border-none w-screen max-w-max px-4">
                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5 lg:max-w-3xl">
                        <div className="grid grid-cols-1 gap-x-6 gap-y-1 p-4 lg:grid-cols-2">
                            {solutions.map((item) => (
                                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <Icon name={item?.icon || "check-solid"} className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <a href={item.href} className="font-semibold text-gray-900">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </a>
                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 px-8 py-6">
                            <div className="flex items-center gap-x-3">
                                <h3 className="text-sm font-semibold leading-6 text-gray-900">Enterprise</h3>
                                <p className="rounded-full bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-600">New</p>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Empower your entire team with even more advanced tools.
                            </p>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </CardContent>
    )
}
export const Simple = () => {
    const solutions = [
        { name: 'Analytics', href: '#' },
        { name: 'Engagement', href: '#' },
        { name: 'Security', href: '#' },
        { name: 'Integrations', href: '#' },
        { name: 'Automations', href: '#' },
        { name: 'Reports', href: '#' },
    ]
    return (
        <CardContent className='w-full h-[36rem]'>
            <CardHeader>
                <CardDescription>
                    Simple
                </CardDescription>
            </CardHeader>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='flex justify-center w-full'>
                        <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                            Solutions
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="z-10 flex shadow-none border-none w-screen max-w-max px-4">
                    <div className="w-56 shrink rounded-xl bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-lg ring-1 ring-gray-900/5">
                        {solutions.map((item) => (
                            <a key={item.name} href={item.href} className="block p-2 hover:text-indigo-600">
                                {item.name}
                            </a>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </CardContent>
    )
}
export const StackedWithFooterList = () => {
    const resources: DataWithDesc[] = [
        { name: 'Help center', description: 'Get all of your questions answered', href: '#', icon: "ferris-wheel-solid" },
        { name: 'Guides', description: 'Learn how to maximize our platform', href: '#', icon: "book-bible-solid" },
        { name: 'Events', description: 'See meet-ups and other events near you', href: '#', icon: "calendar-alt-solid" },
    ]
    const recentPosts = [
        { id: 1, title: 'Boost your conversion rate', href: '#', date: 'Mar 5, 2023', datetime: '2023-03-05' },
        {
            id: 2,
            title: 'How to use search engine optimization to drive traffic to your site',
            href: '#',
            date: 'Feb 25, 2023',
            datetime: '2023-02-25',
        },
        { id: 3, title: 'Improve your customer experience', href: '#', date: 'Feb 21, 2023', datetime: '2023-02-21' },
    ]

    return (
        <CardContent className='w-full h-[36rem]'>
            <CardHeader>
                <CardDescription>
                    Stacked With FooterList
                </CardDescription>
            </CardHeader>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='flex justify-center w-full'>
                        <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                            Resources
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="z-10 flex shadow-none border-none w-screen max-w-max px-4">
                    <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        <div className="p-4">
                            {resources.map((item) => (
                                <div key={item.name} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                    <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                        <Icon name={item?.icon || "check-solid"} className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <div>
                                        <a href={item.href} className="font-semibold text-gray-900">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                        </a>
                                        <p className="mt-1 text-gray-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="bg-gray-50 p-8">
                            <div className="flex justify-between">
                                <h3 className="text-sm font-semibold leading-6 text-gray-500">Recent posts</h3>
                                <a href="#" className="text-sm font-semibold leading-6 text-indigo-600">
                                    See all <span aria-hidden="true">&rarr;</span>
                                </a>
                            </div>
                            <ul role="list" className="mt-6 space-y-6">
                                {recentPosts.map((post) => (
                                    <li key={post.id} className="relative">
                                        <time dateTime={post.datetime} className="block text-xs leading-6 text-gray-600">
                                            {post.date}
                                        </time>
                                        <a href={post.href} className="block truncate text-sm font-semibold leading-6 text-gray-900">
                                            {post.title}
                                            <span className="absolute inset-0" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </CardContent>
    )
}
export const SimpleWithDescriptions = () => {
    const solutions: DataWithDesc[] = [
        { name: 'Blog', description: 'Learn about tips, product updates and company culture', href: '#' },
        {
            name: 'Help center',
            description: 'Get all of your questions answered in our forums of contact support',
            href: '#',
        },
        { name: 'Guides', description: 'Learn how to maximize our platform to get the most out of it', href: '#' },
        { name: 'Events', description: 'Check out webinars with experts and learn about our annual conference', href: '#' },
        { name: 'Security', description: 'Understand how we take your privacy seriously', href: '#' },
    ]

    return (
        <CardContent className='w-full h-[36rem]'>
            <CardHeader>
                <CardDescription>
                    Simple With Descriptions
                </CardDescription>
            </CardHeader>
            <Popover>
                <PopoverTrigger asChild>
                    <div className='flex justify-center w-full'>
                        <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                            Solutions
                        </Button>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="z-10 flex shadow-none border-none w-screen max-w-max p-0 pt-2">
                    <div className="w-screen max-w-sm flex-auto rounded-3xl bg-white p-4 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                        {solutions.map((item) => (
                            <div key={item.name} className="relative rounded-lg p-4 hover:bg-gray-50">
                                <a href={item.href} className="font-semibold text-gray-900">
                                    {item.name}
                                    <span className="absolute inset-0" />
                                </a>
                                <p className="mt-1 text-gray-600">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </CardContent>
    )
}

export const FullWidth = () => {
    const solutions: DataWithDesc[] = [
        {
            name: 'Analytics',
            description: 'Get a better understanding of where your traffic is coming from',
            href: '#',
            icon: "pie-chart-solid",
        },
        {
            name: 'Engagement',
            description: 'Speak directly to your customers with our engagement tool',
            href: '#',
            icon: "i-cursor-solid",
        },
        { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: "fingerprint-solid" },
        {
            name: 'Integrations',
            description: "Connect with third-party tools that you're already using",
            href: '#',
            icon: "plus-square-solid",
        },
    ]
    const callsToAction: Data[] = [
        { name: 'Watch demo', href: '#', icon: "play-circle-solid" },
        { name: 'Contact sales', href: '#', icon: "phone-solid" },
        { name: 'View all products', href: '#', icon: "rectangle-history-circle-user-solid" },
    ]

    return (
        <CardContent className='w-full h-screen mt-4 px-0'>
            <CardHeader>
                <CardDescription>
                    Full width
                </CardDescription>
            </CardHeader>
            <Popover>
                <div className="shadow-none w-full z-0">
                    <div className='bg-white py-5 shadow-none w-full '>
                        <PopoverTrigger asChild>
                            <div className='w-full max-w-full px-6 data-[state=closed]:pb-6 data-[state=open]:pb-0 lg:px-8 data-[state=closed]:shadow-md data-[state=open]:shadow-none border-0'>
                                <Button variant="ghost" className='shadow-none inline-flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900' icon="chevron-down-regular" alignIcon='right'>
                                    Solutions
                                </Button>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top" align='start' alignOffset={-2}
                            sideOffset={0} className="p-0  mx-[0.10rem] pr-[2.85rem] rounded-none mt-5 w-full shadow-b-sm shadow-x-none border-0 appearance-none ring-0 ring-gray-900/5 z-0">
                            <div className="mx-auto grid max-w-[83.20rem] grid-cols-1 gap-2 shadow-none p-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-0 sm:py-10 lg:grid-cols-4 lg:gap-4 lg:px-8 xl:gap-8">
                                {solutions.map((item) => (
                                    <div
                                        key={item.name}
                                        className="group relative -mx-3 flex gap-6 rounded-lg p-3 text-sm leading-6 hover:bg-gray-50 sm:flex-col sm:p-6"
                                    >
                                        <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                            <Icon name={item?.icon || "check-solid"} className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                            <a href={item.href} className="font-semibold text-gray-900">
                                                {item.name}
                                                <span className="absolute inset-0" />
                                            </a>
                                            <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 w-full">
                                <div className="mx-auto max-w-full p-0">
                                    <div className="grid grid-cols-1 divide-y divide-gray-900/5 w-full sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:border-x sm:border-gray-900/5">
                                        {callsToAction.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center gap-x-2.5 p-3 px-6 text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-100 sm:justify-center sm:px-0"
                                            >
                                                <Icon name={item?.icon || "check-solid"} className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                                {item.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </PopoverContent>
                    </div>
                </div>
            </Popover>
        </CardContent>
    )
}

export const FullWidthTwoColumns = () => {
    const engagement: Data[] = [
        { name: 'About', href: '#', icon: "info-circle-solid" },
        { name: 'Customers', href: '#', icon: "user-solid" },
        { name: 'Press', href: '#', icon: "newspaper-solid" },
        { name: 'Careers', href: '#', icon: "briefcase-solid" },
        { name: 'Privacy', href: '#', icon: "shield-solid" },
    ]
    const resources: Data[] = [
        { name: 'Community', href: '#', icon: "user-group-solid" },
        { name: 'Partners', href: '#', icon: "globe-oceania-brands" },
        { name: 'Guides', href: '#', icon: "book-open-alt-solid" },
        { name: 'Webinars', href: '#', icon: "video-camera-solid" },
    ]
    const recentPosts: any = [
        {
            id: 1,
            title: 'Boost your conversion rate',
            href: '#',
            date: 'Mar 16, 2023',
            datetime: '2023-03-16',
            category: { title: 'Marketing', href: '#' },
            imageUrl:
                'https://images.unsplash.com/photo-1496128858413-b36217c2ce36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3603&q=80',
            description:
                'Et et dolore officia quis nostrud esse aute cillum irure do esse. Eiusmod ad deserunt cupidatat est magna Lorem.',
        },
        {
            id: 2,
            title: 'How to use search engine optimization to drive sales',
            href: '#',
            date: 'Mar 10, 2023',
            datetime: '2023-03-10',
            category: { title: 'Sales', href: '#' },
            imageUrl:
                'https://images.unsplash.com/photo-1547586696-ea22b4d4235d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80',
            description: 'Optio cum necessitatibus dolor voluptatum provident commodi et.',
        },
    ]
    return (
        <CardContent className='w-full h-screen mt-4 px-0'>
            <CardHeader>
                <CardDescription>
                    Full-width two-columns
                </CardDescription>
            </CardHeader>
            <Popover>
                <div className="shadow-none w-full z-0">
                    <div className='bg-white py-5 shadow-none border-0 appearance-none'>
                        <PopoverTrigger asChild>
                            <div className='w-full max-w-full pb-4 px-6 lg:px-8 data-[state=closed]:shadow-md data-[state=open]:shadow-none border-0'>
                                <Button variant="ghost" className='inline-flex shadow-none items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900' icon="chevron-down-regular" alignIcon='right'>
                                    Solutions
                                </Button>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top" align='start' alignOffset={-2}
                            sideOffset={0} className="p-1 ml-[0.20rem] pr-[2.85rem] border-0 rounded-t-none bg-white mt-5 w-full shadow-b-lg appearance-none border-t-none ring-0 ring-gray-900/5 z-0">
                            <div className="w-full grid max-w-[80rem] grid-cols-1 gap-x-8 gap-y-10 px-6 py-10 lg:grid-cols-2 lg:px-8">
                                <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8">
                                    <div>
                                        <h3 className="text-sm font-medium leading-6 text-gray-500">Engagement</h3>
                                        <div className="mt-6 flow-root">
                                            <div className="-my-2">
                                                {engagement.map((item: any) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
                                                    >
                                                        <Icon name={item?.name} className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium leading-6 text-gray-500">Resources</h3>
                                        <div className="mt-6 flow-root">
                                            <div className="-my-2">
                                                {resources.map((item: any) => (
                                                    <a
                                                        key={item.name}
                                                        href={item.href}
                                                        className="flex gap-x-4 py-2 text-sm font-semibold leading-6 text-gray-900"
                                                    >
                                                        <Icon name={item?.name} className="h-6 w-6 flex-none text-gray-400" aria-hidden="true" />
                                                        {item.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-10 sm:gap-8 lg:grid-cols-2">
                                    <h3 className="sr-only">Recent posts</h3>
                                    {recentPosts.map((post: any) => (
                                        <article
                                            key={post.id}
                                            className="relative isolate flex max-w-2xl flex-col gap-x-8 gap-y-6 sm:flex-row sm:items-start lg:flex-col lg:items-stretch"
                                        >
                                            <div className="relative flex-none">
                                                <Image
                                                    className="aspect-[2/1] w-full rounded-lg bg-gray-100 object-cover sm:aspect-[16/9] sm:h-32 lg:h-auto"
                                                    src={post.imageUrl}
                                                    alt=""
                                                />
                                                <div className="absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-x-4">
                                                    <time dateTime={post.datetime} className="text-sm leading-6 text-gray-600">
                                                        {post.date}
                                                    </time>
                                                    <a
                                                        href={post.category.href}
                                                        className="relative z-0 rounded-full bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
                                                    >
                                                        {post.category.title}
                                                    </a>
                                                </div>
                                                <h4 className="mt-2 text-sm font-semibold leading-6 text-gray-900">
                                                    <a href={post.href}>
                                                        <span className="absolute inset-0" />
                                                        {post.title}
                                                    </a>
                                                </h4>
                                                <p className="mt-2 text-sm leading-6 text-gray-600">{post.description}</p>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </div>
                </div>
            </Popover>
        </CardContent>
    )
}

const FlyoutMenu = () => {

    return (
        <Card className='col-span-2'>
            <StackedWithFooterAction />
            <hr />
            <FullWidthTwoColumns />
            <hr />
            <StackedWithFooterList />
            <hr />
            <FullWidth />
            <hr />
            <SimpleWithDescriptions />
            <hr />
            <TwoColumn />
            <hr />
            <Simple />
            <hr />
        </Card >
    )
}

export default FlyoutMenu
