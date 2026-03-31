<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import * as Tooltip from "$lib/registry/ui/tooltip/index.js";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";
	import InfoIcon from "@lucide/svelte/icons/info";
</script>

<div class="grid w-full max-w-sm gap-4">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Enter password" type="password" />
		<InputGroup.Addon align="inline-end">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button
							{...props}
							variant="ghost"
							aria-label="Info"
							size="icon-xs"
						>
							<InfoIcon />
						</InputGroup.Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>Password must be at least 8 characters</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="Your email address" />
		<InputGroup.Addon align="inline-end">
			<Tooltip.Root>
				<Tooltip.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button
							{...props}
							variant="ghost"
							aria-label="Help"
							size="icon-xs"
						>
							<HelpCircleIcon />
						</InputGroup.Button>
					{/snippet}
				</Tooltip.Trigger>
				<Tooltip.Content>
					<p>We'll use this to send you notifications</p>
				</Tooltip.Content>
			</Tooltip.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="Enter API key" />
		<Tooltip.Root>
			<Tooltip.Trigger>
				{#snippet child({ props })}
					<InputGroup.Addon>
						<InputGroup.Button
							{...props}
							variant="ghost"
							aria-label="Help"
							size="icon-xs"
						>
							<HelpCircleIcon />
						</InputGroup.Button>
					</InputGroup.Addon>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content side="left">
				<p>Click for help with API keys</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</InputGroup.Root>
</div>
