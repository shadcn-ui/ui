<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import * as Label from "$lib/registry/ui/label/index.js";
	import * as Tooltip from "$lib/registry/ui/tooltip/index.js";
	import InfoIcon from "@lucide/svelte/icons/info";
</script>

<div class="grid w-full max-w-sm gap-4">
	<InputGroup.Root>
		<InputGroup.Input id="email" placeholder="shadcn" />
		<InputGroup.Addon>
			<Label.Root for="email">@</Label.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input id="email-2" placeholder="shadcn@vercel.com" />
		<InputGroup.Addon align="block-start">
			<Label.Root for="email-2" class="text-foreground">Email</Label.Root>
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button
							{...props}
							variant="ghost"
							aria-label="Help"
							class="ms-auto rounded-full"
							size="icon-xs"
						>
							<InfoIcon />
						</InputGroup.Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>We'll use this to send you notifications</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
