import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import { NavMain } from './nav-main.gts';
import { NavProjects } from './nav-projects.gts';
import { NavUser } from './nav-user.gts';
import { TeamSwitcher } from './team-switcher.gts';

import type { ComponentLike } from '@glint/template';

import AudioWaveform from '~icons/lucide/audio-waveform';
import BookOpen from '~icons/lucide/book-open';
import Bot from '~icons/lucide/bot';
import Command from '~icons/lucide/command';
import Frame from '~icons/lucide/frame';
import GalleryVerticalEnd from '~icons/lucide/gallery-vertical-end';
import Map from '~icons/lucide/map';
import PieChart from '~icons/lucide/pie-chart';
import Settings2 from '~icons/lucide/settings-2';
import SquareTerminal from '~icons/lucide/square-terminal';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: 'https://ui.shadcn.com/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd as unknown as ComponentLike,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform as unknown as ComponentLike,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command as unknown as ComponentLike,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Playground',
      url: '#',
      icon: SquareTerminal as unknown as ComponentLike,
      isActive: true,
      items: [
        {
          title: 'History',
          url: '#',
        },
        {
          title: 'Starred',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Models',
      url: '#',
      icon: Bot as unknown as ComponentLike,
      items: [
        {
          title: 'Genesis',
          url: '#',
        },
        {
          title: 'Explorer',
          url: '#',
        },
        {
          title: 'Quantum',
          url: '#',
        },
      ],
    },
    {
      title: 'Documentation',
      url: '#',
      icon: BookOpen as unknown as ComponentLike,
      items: [
        {
          title: 'Introduction',
          url: '#',
        },
        {
          title: 'Get Started',
          url: '#',
        },
        {
          title: 'Tutorials',
          url: '#',
        },
        {
          title: 'Changelog',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2 as unknown as ComponentLike,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: Frame as unknown as ComponentLike,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChart as unknown as ComponentLike,
    },
    {
      name: 'Travel',
      url: '#',
      icon: Map as unknown as ComponentLike,
    },
  ],
};

<template>
  <Sidebar @collapsible="icon" ...attributes>
    <SidebarHeader>
      <TeamSwitcher @teams={{data.teams}} />
    </SidebarHeader>
    <SidebarContent>
      <NavMain @items={{data.navMain}} />
      <NavProjects @projects={{data.projects}} />
    </SidebarContent>
    <SidebarFooter>
      <NavUser @user={{data.user}} />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

export { data as AppSidebarData };
