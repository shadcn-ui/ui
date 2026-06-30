<script lang="ts">
	import * as Menubar from "@/svelte-ui/menubar/index.js";

	let strikethrough = $state(true);
	let code = $state(false);
	let superscript = $state(false);
	let bookmarks = $state(false);
	let fullUrls = $state(true);
</script>

<Menubar.Root>
	<Menubar.Menu>
		<Menubar.Trigger>View</Menubar.Trigger>
		<Menubar.Content class="w-64">
			<Menubar.CheckboxItem bind:checked={bookmarks}>Always Show Bookmarks Bar</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={fullUrls}>
				Always Show Full URLs
			</Menubar.CheckboxItem>
			<Menubar.Separator />
			<Menubar.Item inset>
				Reload <Menubar.Shortcut>⌘R</Menubar.Shortcut>
			</Menubar.Item>
			<Menubar.Item inset>
				Force Reload <Menubar.Shortcut>⇧⌘R</Menubar.Shortcut>
			</Menubar.Item>
		</Menubar.Content>
	</Menubar.Menu>
	<Menubar.Menu>
		<Menubar.Trigger>Format</Menubar.Trigger>
		<Menubar.Content>
			<Menubar.CheckboxItem bind:checked={strikethrough}>Strikethrough</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={code}>Code</Menubar.CheckboxItem>
			<Menubar.CheckboxItem bind:checked={superscript}>Superscript</Menubar.CheckboxItem>
		</Menubar.Content>
	</Menubar.Menu>
</Menubar.Root>
