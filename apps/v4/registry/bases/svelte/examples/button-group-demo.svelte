<script lang="ts">
	import Archive from "@lucide/svelte/icons/archive";
	import ArrowLeft from "@lucide/svelte/icons/arrow-left";
	import CalendarPlus from "@lucide/svelte/icons/calendar-plus";
	import Clock from "@lucide/svelte/icons/clock";
	import ListFilter from "@lucide/svelte/icons/list-filter";
	import MailCheck from "@lucide/svelte/icons/mail-check";
	import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";
	import Tag from "@lucide/svelte/icons/tag";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
	import * as DropdownMenu from "$lib/registry/ui/dropdown-menu/index.js";

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
