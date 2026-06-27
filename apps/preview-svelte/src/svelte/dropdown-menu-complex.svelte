<script lang="ts">
	import BellIcon from "~icons/ms/notifications";
	import CreditCardIcon from "~icons/ms/credit_card";
	import DownloadIcon from "~icons/ms/download";
	import EyeIcon from "~icons/ms/visibility";
	import FileCodeIcon from "~icons/ms/code";
	import FileIcon from "~icons/ms/description";
	import FileTextIcon from "~icons/ms/description";
	import FolderIcon from "~icons/ms/folder";
	import FolderOpenIcon from "~icons/ms/folder_open";
	import FolderSearchIcon from "~icons/ms/folder";
	import HelpCircleIcon from "~icons/ms/help";
	import KeyboardIcon from "~icons/ms/keyboard";
	import LanguagesIcon from "~icons/ms/translate";
	import LayoutIcon from "~icons/ms/dashboard";
	import LogOutIcon from "~icons/ms/logout";
	import MailIcon from "~icons/ms/mail";
	import MonitorIcon from "~icons/ms/monitor";
	import MoonIcon from "~icons/ms/dark_mode";
	import MoreHorizontalIcon from "~icons/ms/more_horiz";
	import PaletteIcon from "~icons/ms/palette";
	import SaveIcon from "~icons/ms/save";
	import SettingsIcon from "~icons/ms/settings";
	import ShieldIcon from "~icons/ms/shield";
	import SunIcon from "~icons/ms/light_mode";
	import UserIcon from "~icons/ms/person";

	import { Button } from "@/svelte-ui/button/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";

	let notifications = $state({
		email: true,
		sms: false,
		push: true,
	});
	let theme = $state("light");
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Complex Menu</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-44">
		<DropdownMenu.Group>
			<DropdownMenu.Label>File</DropdownMenu.Label>
			<DropdownMenu.Item>
				<FileIcon />
				New File
				<DropdownMenu.Shortcut>⌘N</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<FolderIcon />
				New Folder
				<DropdownMenu.Shortcut>⇧⌘N</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<FolderOpenIcon />
					Open Recent
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Recent Projects</DropdownMenu.Label>
						<DropdownMenu.Item>
							<FileCodeIcon />
							Project Alpha
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<FileCodeIcon />
							Project Beta
						</DropdownMenu.Item>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger>
								<MoreHorizontalIcon />
								More Projects
							</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent>
								<DropdownMenu.Item>
									<FileCodeIcon />
									Project Gamma
								</DropdownMenu.Item>
								<DropdownMenu.Item>
									<FileCodeIcon />
									Project Delta
								</DropdownMenu.Item>
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<FolderSearchIcon />
							Browse...
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
			<DropdownMenu.Separator />
			<DropdownMenu.Item>
				<SaveIcon />
				Save
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<DownloadIcon />
				Export
				<DropdownMenu.Shortcut>⇧⌘E</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Label>View</DropdownMenu.Label>
			<DropdownMenu.CheckboxItem bind:checked={notifications.email}>
				<EyeIcon />
				Show Sidebar
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={notifications.sms}>
				<LayoutIcon />
				Show Status Bar
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<PaletteIcon />
					Theme
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Appearance</DropdownMenu.Label>
						<DropdownMenu.RadioGroup bind:value={theme}>
							<DropdownMenu.RadioItem value="light">
								<SunIcon />
								Light
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="dark">
								<MoonIcon />
								Dark
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="system">
								<MonitorIcon />
								System
							</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Group>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Label>Account</DropdownMenu.Label>
			<DropdownMenu.Item>
				<UserIcon />
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<CreditCardIcon />
				Billing
			</DropdownMenu.Item>
			<DropdownMenu.Sub>
				<DropdownMenu.SubTrigger>
					<SettingsIcon />
					Settings
				</DropdownMenu.SubTrigger>
				<DropdownMenu.SubContent>
					<DropdownMenu.Group>
						<DropdownMenu.Label>Preferences</DropdownMenu.Label>
						<DropdownMenu.Item>
							<KeyboardIcon />
							Keyboard Shortcuts
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<LanguagesIcon />
							Language
						</DropdownMenu.Item>
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger>
								<BellIcon />
								Notifications
							</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent>
								<DropdownMenu.Group>
									<DropdownMenu.Label>Notification Types</DropdownMenu.Label>
									<DropdownMenu.CheckboxItem bind:checked={notifications.push}>
										<BellIcon />
										Push Notifications
									</DropdownMenu.CheckboxItem>
									<DropdownMenu.CheckboxItem bind:checked={notifications.email}>
										<MailIcon />
										Email Notifications
									</DropdownMenu.CheckboxItem>
								</DropdownMenu.Group>
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
					</DropdownMenu.Group>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item>
							<ShieldIcon />
							Privacy &amp; Security
						</DropdownMenu.Item>
					</DropdownMenu.Group>
				</DropdownMenu.SubContent>
			</DropdownMenu.Sub>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<HelpCircleIcon />
				Help &amp; Support
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<FileTextIcon />
				Documentation
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item variant="destructive">
				<LogOutIcon />
				Sign Out
				<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
