<script lang="ts">
	import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: NavigationMenuPrimitive.IndicatorProps = $props();
</script>

<NavigationMenuPrimitive.Indicator
	bind:ref
	data-slot="navigation-menu-indicator"
	class={cn(
		"cn-navigation-menu-indicator top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
		className
	)}
	{...restProps}
>
	<div class="cn-navigation-menu-indicator-arrow relative top-[60%] h-2 w-2 rotate-45"></div>
</NavigationMenuPrimitive.Indicator>
