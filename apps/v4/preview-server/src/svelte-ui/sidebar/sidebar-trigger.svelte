<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import IconPlaceholder from "@/svelte-components/icon-placeholder/icon-placeholder.svelte";
	import { cn } from "@/svelte-lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { useSidebar } from "./context.svelte.js";

	let {
		ref = $bindable(null),
		class: className,
		onclick,
		...restProps
	}: ComponentProps<typeof Button> & {
		onclick?: (e: MouseEvent) => void;
	} = $props();

	const sidebar = useSidebar();
</script>

<Button
	bind:ref
	data-sidebar="trigger"
	data-slot="sidebar-trigger"
	variant="ghost"
	size="icon-sm"
	class={cn("cn-sidebar-trigger", className)}
	type="button"
	onclick={(e) => {
		onclick?.(e);
		sidebar.toggle();
	}}
	{...restProps}
>
	<IconPlaceholder
		lucide="PanelLeftIcon"
		tabler="IconLayoutSidebar"
		hugeicons="SidebarLeftIcon"
		phosphor="SidebarIcon"
		remixicon="RiSideBarLine"
	/>
	<span class="sr-only">Toggle Sidebar</span>
</Button>
