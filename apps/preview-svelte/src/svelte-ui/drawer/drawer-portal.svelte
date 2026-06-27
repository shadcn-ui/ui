<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import type { Snippet } from "svelte";

	let { children, ...restProps }: { children?: Snippet; [key: string]: unknown } = $props();
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<DrawerPrimitive.Portal {...(restProps as any)}>
	{@render children?.()}
</DrawerPrimitive.Portal>
