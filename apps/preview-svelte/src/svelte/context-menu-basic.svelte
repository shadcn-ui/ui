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
			<ContextMenu.Item>Back</ContextMenu.Item>
			<ContextMenu.Item disabled>Forward</ContextMenu.Item>
			<ContextMenu.Item>Reload</ContextMenu.Item>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
