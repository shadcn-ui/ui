"use client"

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/tui/ui/card"
import { IconType } from '../../ui/icon';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';

interface MenuItem {
  icon?: IconType;
  title: string;
  badge?: string;
  shortcut?: string;
  children?: MenuItem[];
  isLabel?: boolean;
  isSeparator?: boolean;
  isDisabled?: boolean;
  isCheckBox?: boolean;
  isRadio?: boolean
}

const verticalMenuData: MenuItem[] = [
  {
    title: 'Dashboard',
    shortcut: '',
    icon: "gauge-light",
    isLabel: true,
    badge: '5'
  },
  {
    icon: "user-light",
    title: 'Team',
  },
  {
    icon: "project-diagram-light",
    title: 'Projects',
    badge: '12'
  },
  {
    icon: "calendar-light",
    title: 'Calendar',
    badge: '20+'
  },
  {
    icon: "folder-light",
    title: 'Documents',
  },
  {
    icon: "chart-mixed-light",
    title: 'Reports',
    isCheckBox: true
  },
  {
    title: 'Projects',
    children: [
      {
        icon: "envelope-solid",
        title: 'Website redesign',
        shortcut: 'W'
      },
      {
        title: 'GraphQL API',
        shortcut: 'G',
      },
      {
        title: 'Customer migration guides',
        shortcut: 'C',
      },
      {
        title: 'Profit sharing program',
        shortcut: 'P',
      },
    ]
  },
]

export function VerticalNavigationCard() {
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Vertical Navigation Variants</CardTitle>
        <CardDescription>
          List of possible variants of Vertical Navigation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>
          1. Simple
        </CardDescription>
        <Tabs defaultValue="dashboard" className="flex h-full flex-col">
          <TabsList className="flex h-full flex-col items-start justify-start bg-background" >
            {verticalMenuData.map((item, idx) => (
              <TabsTrigger
                value={item.title}
                className="group flex w-full justify-start gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6 data-[state=active]:bg-muted"
                key={idx}
              >
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      <CardContent>
        <CardDescription>
          2. With Badges
        </CardDescription>
        <Tabs defaultValue="dashboard" className="flex h-full flex-col">
          <TabsList className="flex h-full flex-col items-start justify-start bg-background" >
            {verticalMenuData.map((item, idx) => (
              <>
                <TabsTrigger
                  value={item.title}
                  className="group flex w-full justify-start gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6 data-[state=active]:bg-muted"
                  key={idx}
                  badge={item.badge ? item.badge : undefined}
                >
                  {item.title}
                </TabsTrigger>
              </>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      <CardContent>
        <CardDescription>
          3. With Icons and Badges
        </CardDescription>
        <Tabs defaultValue="dashboard" className="flex h-full flex-col">
          <TabsList className="flex h-full flex-col items-start justify-start bg-background" >
            {verticalMenuData.map((item, idx) => (
              <>
                <TabsTrigger
                  value={item.title}
                  className="group flex w-full justify-start gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6 data-[state=active]:bg-muted"
                  key={idx}
                  icon={item.icon ? item.icon : undefined}
                  badge={item.badge ? item.badge : undefined}
                >
                  {item.title}
                </TabsTrigger>
              </>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      <CardContent>
        <CardDescription>
          4. With Icons
        </CardDescription>
        <Tabs defaultValue="dashboard" className="flex h-full flex-col">
          <TabsList className="flex h-full flex-col items-start justify-start bg-background" >
            {verticalMenuData.map((item, idx) => (
              <>
                <TabsTrigger
                  value={item.title}
                  className="group flex w-full justify-start gap-x-3 rounded-md p-2 pl-3 text-sm font-semibold leading-6 data-[state=active]:bg-muted"
                  key={idx}
                  icon={item.icon ? item.icon : undefined}
                >
                  {item.title}
                </TabsTrigger>
              </>
            ))}
          </TabsList>
        </Tabs>
      </CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  )
}
