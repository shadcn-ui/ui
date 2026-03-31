<script lang="ts">
	import { ContextMenu as ContextMenuPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		...restProps
	}: ContextMenuPrimitive.RadioGroupProps = $props();
</script>

<ContextMenuPrimitive.RadioGroup
	bind:ref
	bind:value
	data-slot="context-menu-radio-group"
	{...restProps}
/>
