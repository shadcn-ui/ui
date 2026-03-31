<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from "bits-ui";

	let { ref = $bindable(null), ...restProps }: RangeCalendarPrimitive.GridBodyProps = $props();
</script>

<RangeCalendarPrimitive.GridBody bind:ref {...restProps} />
