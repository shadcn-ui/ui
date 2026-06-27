<script setup lang="ts">
import { ref } from 'vue'
import ArchiveIcon from "@material-symbols/svg-400/rounded/archive.svg?component"
import ArrowLeftIcon from "@material-symbols/svg-400/rounded/arrow_left.svg?component"
import CalendarPlusIcon from "@material-symbols/svg-400/rounded/calendar_add_on.svg?component"
import ClockIcon from "@material-symbols/svg-400/rounded/schedule.svg?component"
import ListFilterPlusIcon from "@material-symbols/svg-400/rounded/filter_list.svg?component"
import MailCheckIcon from "@material-symbols/svg-400/rounded/mark_email_read.svg?component"
import MoreHorizontalIcon from "@material-symbols/svg-400/rounded/more_horiz.svg?component"
import TagIcon from "@material-symbols/svg-400/rounded/tag.svg?component"
import Trash2Icon from "@material-symbols/svg-400/rounded/delete.svg?component"
import { Button } from '@/ui/button'
import { ButtonGroup } from '@/ui/button-group'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '@/ui/dropdown-menu'

const label = ref('personal')
</script>

<template>
  <ButtonGroup>
    <ButtonGroup class="hidden sm:flex">
      <Button variant="outline" size="icon" aria-label="Go Back">
        <ArrowLeftIcon />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline">
        Archive
      </Button>
      <Button variant="outline">
        Report
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button variant="outline">
        Snooze
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" size="icon" aria-label="More Options">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <MailCheckIcon />
              Mark as Read
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ArchiveIcon />
              Archive
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <ClockIcon />
              Snooze
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CalendarPlusIcon />
              Add to Calendar
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListFilterPlusIcon />
              Add to List
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <TagIcon class="mr-2 size-4" />
                Label As...
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup v-model="label">
                  <DropdownMenuRadioItem value="personal">
                    Personal
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="work">
                    Work
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="other">
                    Other
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Trash
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  </ButtonGroup>
</template>
