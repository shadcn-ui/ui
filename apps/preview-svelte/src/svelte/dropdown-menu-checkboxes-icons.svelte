<script lang="ts">
	import BellIcon from "~icons/ms/notifications";
	import MailIcon from "~icons/ms/mail";
	import MessageSquareIcon from "~icons/ms/chat";

	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import { Button } from "@/svelte-ui/button/index.js";

	let notifications = $state({
		email: true,
		sms: false,
		push: true,
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Notifications</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-48">
		<DropdownMenu.Group>
			<DropdownMenu.Label>Notification Preferences</DropdownMenu.Label>
			<DropdownMenu.CheckboxItem bind:checked={notifications.email}>
				<MailIcon />
				Email notifications
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={notifications.sms}>
				<MessageSquareIcon />
				SMS notifications
			</DropdownMenu.CheckboxItem>
			<DropdownMenu.CheckboxItem bind:checked={notifications.push}>
				<BellIcon />
				Push notifications
			</DropdownMenu.CheckboxItem>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
