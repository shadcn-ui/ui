<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "@/svelte-lib/utils.js";

	let {
		class: className,
		...restProps
	}: DrawerPrimitive.DescriptionProps = $props();
</script>

<DrawerPrimitive.Description
	data-slot="drawer-description"
	class={cn("cn-drawer-description", className)}
	{...restProps}
/>
