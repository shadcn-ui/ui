<script lang="ts">
	import Archive from "~icons/ms/archive";
	import ArrowLeft from "~icons/ms/arrow_left";
	import CalendarPlus from "~icons/ms/calendar_add_on";
	import Clock from "~icons/ms/schedule";
	import ListFilter from "~icons/ms/filter_list";
	import MailCheck from "~icons/ms/mark_email_read";
	import MoreHorizontal from "~icons/ms/more_horiz";
	import Tag from "~icons/ms/tag";
	import Trash2 from "~icons/ms/delete";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";

	let label = $state("personal");
</script>

<ButtonGroup.Root>
	<ButtonGroup.Root class="hidden sm:flex">
		<Button variant="outline" size="icon-sm" aria-label="Go Back">
			<ArrowLeft />
		</Button>
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button size="sm" variant="outline">Archive</Button>
		<Button size="sm" variant="outline">Report</Button>
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button size="sm" variant="outline">Snooze</Button>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" size="icon-sm" aria-label="More Options">
						<MoreHorizontal />
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end" class="w-52">
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<MailCheck />
						Mark as Read
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<Archive />
						Archive
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<Clock />
						Snooze
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<CalendarPlus />
						Add to Calendar
					</DropdownMenu.Item>
					<DropdownMenu.Item>
						<ListFilter />
						Add to List
					</DropdownMenu.Item>
					<DropdownMenu.Sub>
						<DropdownMenu.SubTrigger>
							<Tag />
							Label As...
						</DropdownMenu.SubTrigger>
						<DropdownMenu.SubContent>
							<DropdownMenu.RadioGroup bind:value={label}>
								<DropdownMenu.RadioItem value="personal">
									Personal
								</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="work">Work</DropdownMenu.RadioItem>
								<DropdownMenu.RadioItem value="other">Other</DropdownMenu.RadioItem>
							</DropdownMenu.RadioGroup>
						</DropdownMenu.SubContent>
					</DropdownMenu.Sub>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item class="text-destructive focus:text-destructive">
						<Trash2 />
						Trash
					</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</ButtonGroup.Root>
</ButtonGroup.Root>
