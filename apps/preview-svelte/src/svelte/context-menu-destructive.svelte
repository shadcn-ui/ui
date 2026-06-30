<script lang="ts">
	import PencilIcon from "~icons/ms/edit";
	import ShareIcon from "~icons/ms/share";
	import TrashIcon from "~icons/ms/delete";

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
				<PencilIcon />
				Edit
			</ContextMenu.Item>
			<ContextMenu.Item>
				<ShareIcon />
				Share
			</ContextMenu.Item>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Item variant="destructive">
				<TrashIcon />
				Delete
			</ContextMenu.Item>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
