<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import type { DateValue } from "@internationalized/date";
	import { Calendar } from "@/svelte-ui/calendar/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Card from "@/svelte-ui/card/index.js";

	let value = $state<DateValue>(today(getLocalTimeZone()));

	const presets = [
		{ label: "Today", days: 0 },
		{ label: "Tomorrow", days: 1 },
		{ label: "In 3 days", days: 3 },
		{ label: "In a week", days: 7 },
		{ label: "In 2 weeks", days: 14 },
	];

	function applyPreset(days: number) {
		value = today(getLocalTimeZone()).add({ days });
	}
</script>

<Card.Root class="mx-auto w-fit max-w-[300px]">
	<Card.Content>
		<Calendar type="single" bind:value class="p-0" />
	</Card.Content>
	<Card.Footer class="flex flex-wrap gap-2 border-t">
		{#each presets as preset (preset.days)}
			<Button
				variant="outline"
				size="sm"
				class="flex-1"
				onclick={() => applyPreset(preset.days)}
			>
				{preset.label}
			</Button>
		{/each}
	</Card.Footer>
</Card.Root>
