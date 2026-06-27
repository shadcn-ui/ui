<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import type { Snippet } from "svelte";

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		children,
		...restProps
	}: DrawerPrimitive.Props & { children?: Snippet } = $props();
</script>

<DrawerPrimitive.Root {shouldScaleBackground} bind:open bind:activeSnapPoint {...restProps}>
	{@render children?.()}
</DrawerPrimitive.Root>
