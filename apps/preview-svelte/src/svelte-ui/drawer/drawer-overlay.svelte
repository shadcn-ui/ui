<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "@/svelte-lib/utils.js";

	let {
		class: className,
		...restProps
	}: DrawerPrimitive.OverlayProps = $props();
</script>

<DrawerPrimitive.Overlay
	data-slot="drawer-overlay"
	class={cn("cn-drawer-overlay fixed inset-0 z-50", className)}
	{...restProps}
/>
