<script lang="ts">
	import CreditCardIcon from "~icons/ms/credit_card";
	import LogOutIcon from "~icons/ms/logout";
	import SettingsIcon from "~icons/ms/settings";
	import UserIcon from "~icons/ms/person";

	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline">Open</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Item>
			<UserIcon />
			Profile
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<CreditCardIcon />
			Billing
		</DropdownMenu.Item>
		<DropdownMenu.Item>
			<SettingsIcon />
			Settings
		</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Item variant="destructive">
			<LogOutIcon />
			Log out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
