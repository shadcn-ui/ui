<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import { RangeCalendar } from "@/svelte-ui/range-calendar/index.js";

	const start = today(getLocalTimeZone());
	const end = start.add({ days: 30 });

	let value = $state({
		start,
		end,
	});
</script>

<RangeCalendar bind:value class="rounded-md border" numberOfMonths={2} />
