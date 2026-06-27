<script lang="ts">
	import BellIcon from "~icons/ms/notifications";
	import CalculatorIcon from "~icons/ms/calculate";
	import CalendarIcon from "~icons/ms/calendar_month";
	import ClipboardPasteIcon from "~icons/ms/content_paste";
	import CodeIcon from "~icons/ms/code";
	import CopyIcon from "~icons/ms/content_copy";
	import CreditCardIcon from "~icons/ms/credit_card";
	import FileTextIcon from "~icons/ms/description";
	import FolderIcon from "~icons/ms/folder";
	import FolderPlusIcon from "~icons/ms/create_new_folder";
	import HelpCircleIcon from "~icons/ms/help";
	import HomeIcon from "~icons/ms/home";
	import ImageIcon from "~icons/ms/image";
	import InboxIcon from "~icons/ms/inbox";
	import LayoutGridIcon from "~icons/ms/grid_view";
	import ListIcon from "~icons/ms/list";
	import PlusIcon from "~icons/ms/add";
	import ScissorsIcon from "~icons/ms/content_cut";
	import SettingsIcon from "~icons/ms/settings";
	import TrashIcon from "~icons/ms/delete";
	import UserIcon from "~icons/ms/person";
	import ZoomInIcon from "~icons/ms/zoom_in";
	import ZoomOutIcon from "~icons/ms/zoom_out";
	import * as Command from "@/svelte-ui/command/index.js";
	import { Button } from "@/svelte-ui/button/index.js";

	let open = $state(false);
</script>

<div class="flex flex-col gap-4">
	<Button onclick={() => (open = true)} variant="outline" class="w-fit">
		Open Menu
	</Button>
	<Command.Dialog bind:open>
		<Command.Input placeholder="Type a command or search..." />
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group heading="Navigation">
				<Command.Item>
					<HomeIcon />
					<span>Home</span>
					<Command.Shortcut>⌘H</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<InboxIcon />
					<span>Inbox</span>
					<Command.Shortcut>⌘I</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<FileTextIcon />
					<span>Documents</span>
					<Command.Shortcut>⌘D</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<FolderIcon />
					<span>Folders</span>
					<Command.Shortcut>⌘F</Command.Shortcut>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Actions">
				<Command.Item>
					<PlusIcon />
					<span>New File</span>
					<Command.Shortcut>⌘N</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<FolderPlusIcon />
					<span>New Folder</span>
					<Command.Shortcut>⇧⌘N</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<CopyIcon />
					<span>Copy</span>
					<Command.Shortcut>⌘C</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<ScissorsIcon />
					<span>Cut</span>
					<Command.Shortcut>⌘X</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<ClipboardPasteIcon />
					<span>Paste</span>
					<Command.Shortcut>⌘V</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<TrashIcon />
					<span>Delete</span>
					<Command.Shortcut>⌫</Command.Shortcut>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="View">
				<Command.Item>
					<LayoutGridIcon />
					<span>Grid View</span>
				</Command.Item>
				<Command.Item>
					<ListIcon />
					<span>List View</span>
				</Command.Item>
				<Command.Item>
					<ZoomInIcon />
					<span>Zoom In</span>
					<Command.Shortcut>⌘+</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<ZoomOutIcon />
					<span>Zoom Out</span>
					<Command.Shortcut>⌘-</Command.Shortcut>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Account">
				<Command.Item>
					<UserIcon />
					<span>Profile</span>
					<Command.Shortcut>⌘P</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<CreditCardIcon />
					<span>Billing</span>
					<Command.Shortcut>⌘B</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<SettingsIcon />
					<span>Settings</span>
					<Command.Shortcut>⌘S</Command.Shortcut>
				</Command.Item>
				<Command.Item>
					<BellIcon />
					<span>Notifications</span>
				</Command.Item>
				<Command.Item>
					<HelpCircleIcon />
					<span>Help &amp; Support</span>
				</Command.Item>
			</Command.Group>
			<Command.Separator />
			<Command.Group heading="Tools">
				<Command.Item>
					<CalculatorIcon />
					<span>Calculator</span>
				</Command.Item>
				<Command.Item>
					<CalendarIcon />
					<span>Calendar</span>
				</Command.Item>
				<Command.Item>
					<ImageIcon />
					<span>Image Editor</span>
				</Command.Item>
				<Command.Item>
					<CodeIcon />
					<span>Code Editor</span>
				</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Dialog>
</div>
