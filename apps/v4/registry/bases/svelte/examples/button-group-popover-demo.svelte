<script lang="ts">
	import Bot from "@lucide/svelte/icons/bot";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
	import * as Popover from "$lib/registry/ui/popover/index.js";
	import { Separator } from "$lib/registry/ui/separator/index.js";
	import { Textarea } from "$lib/registry/ui/textarea/index.js";
</script>

<ButtonGroup.Root>
	<Button variant="outline" size="sm">
		<Bot />
		Copilot
	</Button>
	<Popover.Root>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="icon-sm" aria-label="Open Popover">
					<ChevronDown />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content align="end" class="rounded-xl p-0 text-sm">
			<div class="px-4 py-3">
				<div class="text-sm font-medium">Agent Tasks</div>
			</div>
			<Separator />
			<div class="p-4 text-sm *:[p:not(:last-child)]:mb-2">
				<Textarea
					placeholder="Describe your task in natural language."
					class="mb-4 resize-none"
				/>
				<p class="font-medium">Start a new task with Copilot</p>
				<p class="text-muted-foreground">
					Describe your task in natural language. Copilot will work in the background and
					open a pull request for your review.
				</p>
			</div>
		</Popover.Content>
	</Popover.Root>
</ButtonGroup.Root>
