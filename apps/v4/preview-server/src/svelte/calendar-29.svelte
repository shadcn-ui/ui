<script lang="ts">
	import { Label } from "@/svelte-ui/label/index.js";
	import * as Popover from "@/svelte-ui/popover/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import { Calendar } from "@/svelte-ui/calendar/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import { parseDate } from "chrono-node";
	import { CalendarDate, getLocalTimeZone, type DateValue } from "@internationalized/date";
	import { untrack } from "svelte";

	function formatDate(date: DateValue | undefined) {
		if (!date) return "";

		return date.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	}

	const id = $props.id();

	let open = $state(false);
	let inputValue = $state("In 2 days");
	let value = $state<DateValue | undefined>(
		untrack(() => {
			const date = parseDate(inputValue);
			if (date)
				return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
			return undefined;
		})
	);
</script>

<div class="flex flex-col gap-3">
	<Label for="{id}-date" class="px-1">Schedule Date</Label>
	<div class="relative flex gap-2">
		<Input
			id="date"
			bind:value={
				() => inputValue,
				(v) => {
					inputValue = v;
					const date = parseDate(v);
					if (date) {
						value = new CalendarDate(
							date.getFullYear(),
							date.getMonth() + 1,
							date.getDate()
						);
					}
				}
			}
			placeholder="Tomorrow or next week"
			class="bg-background pe-10"
			onkeydown={(e) => {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					open = true;
				}
			}}
		/>
		<Popover.Root bind:open>
			<Popover.Trigger id="{id}-date-picker">
				{#snippet child({ props })}
					<Button
						{...props}
						variant="ghost"
						class="absolute end-2 top-1/2 size-6 -translate-y-1/2"
					>
						<CalendarIcon class="size-3.5" />
						<span class="sr-only">Select date</span>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content class="w-auto overflow-hidden p-0" align="end">
				<Calendar
					type="single"
					bind:value
					captionLayout="dropdown"
					onValueChange={(v) => {
						inputValue = formatDate(v);
						open = false;
					}}
				/>
			</Popover.Content>
		</Popover.Root>
	</div>
	<div class="text-muted-foreground px-1 text-sm">
		Your post will be published on
		<span class="font-medium">{formatDate(value)}</span>.
	</div>
</div>
