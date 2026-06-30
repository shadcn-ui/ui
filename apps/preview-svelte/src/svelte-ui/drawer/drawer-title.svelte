<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "@/svelte-lib/utils.js";

	let {
		class: className,
		...restProps
	}: DrawerPrimitive.TitleProps = $props();
</script>

<DrawerPrimitive.Title
	data-slot="drawer-title"
	class={cn("cn-drawer-title", className)}
	{...restProps}
/>
