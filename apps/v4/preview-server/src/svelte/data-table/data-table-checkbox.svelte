<script lang="ts">
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";

	let {
		checked = false,
		indeterminate = false,
		onCheckedChange,
		...restProps
	}: {
		checked?: boolean;
		indeterminate?: boolean;
		onCheckedChange?: (value: boolean) => void;
		"aria-label"?: string;
	} = $props();
</script>

<Checkbox
	{checked}
	{indeterminate}
	{onCheckedChange}
	{...restProps}
/>
