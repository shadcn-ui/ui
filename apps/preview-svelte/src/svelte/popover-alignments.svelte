<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Popover from "@/svelte-ui/popover/index.js";
</script>

<div class="flex gap-6">
	<Popover.Root>
		<Popover.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>Start</Popover.Trigger>
		<Popover.Content align="start" class="w-40">Aligned to start</Popover.Content>
	</Popover.Root>
	<Popover.Root>
		<Popover.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>Center</Popover.Trigger>
		<Popover.Content align="center" class="w-40">Aligned to center</Popover.Content>
	</Popover.Root>
	<Popover.Root>
		<Popover.Trigger class={buttonVariants({ variant: "outline", size: "sm" })}>End</Popover.Trigger>
		<Popover.Content align="end" class="w-40">Aligned to end</Popover.Content>
	</Popover.Root>
</div>
