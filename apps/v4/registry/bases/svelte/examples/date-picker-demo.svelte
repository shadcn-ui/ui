<script lang="ts">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import { DateFormatter, type DateValue, getLocalTimeZone } from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
	import { Calendar } from "$lib/registry/ui/calendar/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";

	const df = new DateFormatter("en-US", {
		dateStyle: "long",
	});

	let value = $state<DateValue | undefined>();
	let contentRef = $state<HTMLElement | null>(null);
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
		<CalendarIcon />
		{value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date"}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-auto p-0">
		<Calendar type="single" bind:value captionLayout="dropdown" />
	</Popover.Content>
</Popover.Root>
