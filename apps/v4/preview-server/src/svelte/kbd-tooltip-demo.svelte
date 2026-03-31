<script lang="ts">
	import * as ButtonGroup from "@/svelte-ui/button-group/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Kbd from "@/svelte-ui/kbd/index.js";
	import * as Tooltip from "@/svelte-ui/tooltip/index.js";
</script>

<div class="flex flex-wrap gap-4">
	<ButtonGroup.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button size="sm" variant="outline" {...props}>Save</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div class="flex items-center gap-2">
					Save Changes <Kbd.Root>S</Kbd.Root>
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<Button size="sm" variant="outline" {...props}>Print</Button>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>
				<div class="flex items-center gap-2">
					Print Document
					<Kbd.Group>
						<Kbd.Root>Ctrl</Kbd.Root>
						<Kbd.Root>P</Kbd.Root>
					</Kbd.Group>
				</div>
			</Tooltip.Content>
		</Tooltip.Root>
	</ButtonGroup.Root>
</div>
