<script lang="ts">
	import * as DropdownMenu from "$lib/registry/ui/dropdown-menu/index.js";
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import MoreHorizontalIcon from "@lucide/svelte/icons/more-horizontal";
</script>

<div class="grid w-full max-w-sm gap-4">
	<InputGroup.Root>
		<InputGroup.Input placeholder="Enter file name" />
		<InputGroup.Addon align="inline-end">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button
							{...props}
							variant="ghost"
							aria-label="More"
							size="icon-xs"
						>
							<MoreHorizontalIcon />
						</InputGroup.Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<DropdownMenu.Item>Settings</DropdownMenu.Item>
					<DropdownMenu.Item>Copy path</DropdownMenu.Item>
					<DropdownMenu.Item>Open location</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root class="[--radius:1rem]">
		<InputGroup.Input placeholder="Enter search query" />
		<InputGroup.Addon align="inline-end">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<InputGroup.Button {...props} variant="ghost" class="!pe-1.5 text-xs">
							Search In... <ChevronDownIcon class="size-3" />
						</InputGroup.Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end" class="[--radius:0.95rem]">
					<DropdownMenu.Item>Documentation</DropdownMenu.Item>
					<DropdownMenu.Item>Blog Posts</DropdownMenu.Item>
					<DropdownMenu.Item>Changelog</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
