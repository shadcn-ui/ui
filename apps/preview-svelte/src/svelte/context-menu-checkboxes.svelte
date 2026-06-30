<script lang="ts">
	import * as ContextMenu from "@/svelte-ui/context-menu/index.js";

	let showBookmarksBar = $state(true);
	let showFullUrls = $state(false);
	let showDeveloperTools = $state(true);
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
	>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Group>
			<ContextMenu.CheckboxItem bind:checked={showBookmarksBar}>
				Show Bookmarks Bar
			</ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxItem bind:checked={showFullUrls}>
				Show Full URLs
			</ContextMenu.CheckboxItem>
			<ContextMenu.CheckboxItem bind:checked={showDeveloperTools}>
				Show Developer Tools
			</ContextMenu.CheckboxItem>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
