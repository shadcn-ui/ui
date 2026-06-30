<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Popover from "@/svelte-ui/popover/index.js";

	const physicalSides = ["left", "top", "bottom", "right"] as const;

	const labels: Record<string, string> = {
		left: "يسار",
		top: "أعلى",
		bottom: "أسفل",
		right: "يمين",
	};
</script>

<div class="flex flex-wrap justify-center gap-2" dir="rtl">
	{#each physicalSides as side}
		<Popover.Root>
			<Popover.Trigger class={buttonVariants({ variant: "outline" })}>{labels[side]}</Popover.Trigger>
			<Popover.Content {side} dir="rtl">
				<Popover.Header>
					<Popover.Title>الأبعاد</Popover.Title>
					<Popover.Description>تعيين الأبعاد للطبقة.</Popover.Description>
				</Popover.Header>
			</Popover.Content>
		</Popover.Root>
	{/each}
</div>
