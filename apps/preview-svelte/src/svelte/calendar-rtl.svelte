<script lang="ts">
	import { getLocalTimeZone, today } from "@internationalized/date";
	import { Calendar } from "@/svelte-ui/calendar/index.js";

	let value = today(getLocalTimeZone());
</script>

<div dir="rtl">
	<Calendar
		type="single"
		bind:value
		locale="ar-SA"
		class="rounded-md border shadow-sm"
	/>
</div>
