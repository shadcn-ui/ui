<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import type { ComponentProps } from "svelte";

	let { ...restProps }: ComponentProps<typeof DrawerPrimitive.Trigger> = $props();
</script>

<DrawerPrimitive.Trigger data-slot="drawer-trigger" {...restProps} />
