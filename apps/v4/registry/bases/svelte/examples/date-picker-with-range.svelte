<script lang="ts">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import type { DateRange } from "bits-ui";
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
	} from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
	import { RangeCalendar } from "$lib/registry/ui/range-calendar/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";

	const df = new DateFormatter("en-US", {
		dateStyle: "medium",
	});

	let value: DateRange = $state({
		start: new CalendarDate(2022, 1, 20),
		end: new CalendarDate(2022, 1, 20).add({ days: 20 }),
	});

	let startValue: DateValue | undefined = $state(undefined);
</script>

<div class="grid gap-2">
	<Popover.Root>
		<Popover.Trigger
			class={cn(buttonVariants({ variant: "outline" }), !value && "text-muted-foreground")}
		>
			<CalendarIcon class="me-2 size-4" />
			{#if value && value.start}
				{#if value.end}
					{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
						value.end.toDate(getLocalTimeZone())
					)}
				{:else}
					{df.format(value.start.toDate(getLocalTimeZone()))}
				{/if}
			{:else if startValue}
				{df.format(startValue.toDate(getLocalTimeZone()))}
			{:else}
				Pick a date
			{/if}
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				onStartValueChange={(v) => {
					startValue = v;
				}}
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
