<script lang="ts">
	import FileIcon from "~icons/ms/description";
	import FolderIcon from "~icons/ms/folder";
	import SaveIcon from "~icons/ms/save";
	import SettingsIcon from "~icons/ms/settings";
	import HelpCircleIcon from "~icons/ms/help";
	import TrashIcon from "~icons/ms/delete";

	import * as Menubar from "@/svelte-ui/menubar/index.js";
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>File</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				<FileIcon />
				New File <Menubar.Shortcut>⌘N</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item>
				<FolderIcon />
				Open Folder
			</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item>
				<SaveIcon />
				Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>More</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.Item>
				<SettingsIcon />
				Settings
			</Menubar.Item>
			<Menubar.Item>
				<HelpCircleIcon />
				Help
			</Menubar.Item>
			<Menubar.Separator />
			<Menubar.Item variant="destructive">
				<TrashIcon />
				Delete
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
