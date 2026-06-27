<script lang="ts">
	import BadgeCheckIcon from "~icons/ms/verified";
	import BellIcon from "~icons/ms/notifications";
	import CreditCardIcon from "~icons/ms/credit_card";
	import LogOutIcon from "~icons/ms/logout";

	import * as Avatar from "@/svelte-ui/avatar/index.js";
	import { Button } from "@/svelte-ui/button/index.js";
	import * as DropdownMenu from "@/svelte-ui/dropdown-menu/index.js";
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="rounded-full">
				<Avatar.Root>
					<Avatar.Image src="https://github.com/shadcn.png" alt="shadcn" />
					<Avatar.Fallback>LR</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Group>
			<DropdownMenu.Item>
				<BadgeCheckIcon />
				Account
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<CreditCardIcon />
				Billing
			</DropdownMenu.Item>
			<DropdownMenu.Item>
				<BellIcon />
				Notifications
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<LogOutIcon />
			Sign Out
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
