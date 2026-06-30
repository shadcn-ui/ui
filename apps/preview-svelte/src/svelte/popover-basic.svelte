<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Popover from "@/svelte-ui/popover/index.js";
</script>

<Popover.Root>
	<Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger>
	<Popover.Content align="start">
		<Popover.Header>
			<Popover.Title>Dimensions</Popover.Title>
			<Popover.Description>Set the dimensions for the layer.</Popover.Description>
		</Popover.Header>
	</Popover.Content>
</Popover.Root>
