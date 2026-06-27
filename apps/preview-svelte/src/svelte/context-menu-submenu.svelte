<script lang="ts">
	import * as ContextMenu from "@/svelte-ui/context-menu/index.js";
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
	>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Group>
			<ContextMenu.Item>
				Copy
				<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Cut
				<ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Sub>
			<ContextMenu.SubTrigger>More Tools</ContextMenu.SubTrigger>
			<ContextMenu.SubContent>
				<ContextMenu.Group>
					<ContextMenu.Item>Save Page...</ContextMenu.Item>
					<ContextMenu.Item>Create Shortcut...</ContextMenu.Item>
					<ContextMenu.Item>Name Window...</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item>Developer Tools</ContextMenu.Item>
				</ContextMenu.Group>
				<ContextMenu.Separator />
				<ContextMenu.Group>
					<ContextMenu.Item variant="destructive">Delete</ContextMenu.Item>
				</ContextMenu.Group>
			</ContextMenu.SubContent>
		</ContextMenu.Sub>
	</ContextMenu.Content>
</ContextMenu.Root>
