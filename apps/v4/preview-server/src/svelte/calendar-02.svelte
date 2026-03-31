<script lang="ts">
	import Calendar from "@/svelte-ui/calendar/calendar.svelte";
	import { CalendarDate } from "@internationalized/date";

	let value = $state<CalendarDate | undefined>(new CalendarDate(2025, 6, 12));
</script>

<Calendar type="single" bind:value class="rounded-lg border shadow-sm" numberOfMonths={2} />
