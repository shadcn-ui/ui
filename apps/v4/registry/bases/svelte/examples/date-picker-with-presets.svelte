<script lang="ts">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
	} from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
	import { Calendar } from "$lib/registry/ui/calendar/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";
	import * as Select from "$lib/registry/ui/select/index.js";

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});

	let value: DateValue | undefined = $state();
	const valueString = $derived(value ? df.format(value.toDate(getLocalTimeZone())) : "");

	const items = [
		{ value: 0, label: "Today" },
		{ value: 1, label: "Tomorrow" },
		{ value: 3, label: "In 3 days" },
		{ value: 7, label: "In a week" },
	];
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: "outline",
				class: "w-[280px] justify-start text-start font-normal",
			}),
			!value && "text-muted-foreground"
		)}
	>
		<CalendarIcon class="me-2 size-4" />
		{value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
	</Popover.Trigger>
	<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
		<Select.Root
			type="single"
			bind:value={
				() => valueString,
				(v) => {
					if (!v) return;
					value = today(getLocalTimeZone()).add({ days: Number.parseInt(v) });
				}
			}
		>
			<Select.Trigger>
				{valueString}
			</Select.Trigger>
			<Select.Content>
				{#each items as item (item.value)}
					<Select.Item value={`${item.value}`}>{item.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<div class="rounded-md border">
			<Calendar type="single" bind:value />
		</div>
	</Popover.Content>
</Popover.Root>
