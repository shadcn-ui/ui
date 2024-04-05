import React from 'react'
import { Info, Phone, Video } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { UserData } from '../data';
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/new-york/ui/avatar';
import { buttonVariants } from '@/registry/new-york/ui/button';

interface ChatTopbarProps {
    selectedUser: UserData;
    }
    
    export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];


export default function ChatTopbar({selectedUser}: ChatTopbarProps) {
  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
        <div className="flex items-center gap-2">
          <Avatar className="flex justify-center items-center">
            <AvatarImage
              src={selectedUser.avatar}
              alt={selectedUser.name}
              width={6}
              height={6}
              className="w-10 h-10 "
            />
            <AvatarFallback>
              {selectedUser.name[0].substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{selectedUser.name}</span>
            <span className="text-xs">Active 2 mins ago</span>
          </div>
        </div>

        <div className='flex gap-2'>
          {TopbarIcons.map((icon, index) => (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <icon.icon size={20} className="text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
  )
}
