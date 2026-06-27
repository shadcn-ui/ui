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
			<ContextMenu.Label>File</ContextMenu.Label>
			<ContextMenu.Item>
				New File
				<ContextMenu.Shortcut>⌘N</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Open File
				<ContextMenu.Shortcut>⌘O</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Save
				<ContextMenu.Shortcut>⌘S</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Label>Edit</ContextMenu.Label>
			<ContextMenu.Item>
				Undo
				<ContextMenu.Shortcut>⌘Z</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Redo
				<ContextMenu.Shortcut>⇧⌘Z</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Item>
				Cut
				<ContextMenu.Shortcut>⌘X</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Copy
				<ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
			</ContextMenu.Item>
			<ContextMenu.Item>
				Paste
				<ContextMenu.Shortcut>⌘V</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Item variant="destructive">
				Delete
				<ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
			</ContextMenu.Item>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
