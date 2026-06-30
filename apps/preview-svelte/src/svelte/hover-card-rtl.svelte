<script lang="ts">
	import * as HoverCard from "@/svelte-ui/hover-card/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";

	const physicalSides = ["left", "top", "bottom", "right"] as const;

	const labels: Record<string, string> = {
		left: "يسار",
		top: "أعلى",
		bottom: "أسفل",
		right: "يمين",
	};
</script>

<div class="flex flex-wrap justify-center gap-2">
	{#each physicalSides as side (side)}
		<HoverCard.Root openDelay={10} closeDelay={100}>
			<HoverCard.Trigger class={buttonVariants({ variant: "outline" })}>
				{labels[side]}
			</HoverCard.Trigger>
			<HoverCard.Content {side} class="flex w-64 flex-col gap-1" dir="rtl">
				<div class="font-semibold">سماعات لاسلكية</div>
				<div class="text-muted-foreground text-sm">٩٩.٩٩ $</div>
			</HoverCard.Content>
		</HoverCard.Root>
	{/each}
</div>
