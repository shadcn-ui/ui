<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Tooltip from "@/svelte-ui/tooltip/index.js";

	const sides = ["left", "top", "bottom", "right"] as const;

	const labels: Record<typeof sides[number], string> = {
		left: "يسار",
		top: "أعلى",
		bottom: "أسفل",
		right: "يمين",
	};
</script>

<Tooltip.Provider>
	<div class="flex flex-wrap gap-2" dir="rtl">
		{#each sides as side}
			<Tooltip.Root>
				<Tooltip.Trigger class={buttonVariants({ variant: "outline" }) + " w-fit capitalize"}>
					{labels[side]}
				</Tooltip.Trigger>
				<Tooltip.Content {side}>
					إضافة إلى المكتبة
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</div>
</Tooltip.Provider>
