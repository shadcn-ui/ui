<script lang="ts">
	import ClipboardPasteIcon from "~icons/ms/content_paste";
	import CopyIcon from "~icons/ms/content_copy";
	import ScissorsIcon from "~icons/ms/content_cut";
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
				<CopyIcon />
				Copy
			</ContextMenu.Item>
			<ContextMenu.Item>
				<ScissorsIcon />
				Cut
			</ContextMenu.Item>
			<ContextMenu.Item>
				<ClipboardPasteIcon />
				Paste
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
