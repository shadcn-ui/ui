<script lang="ts">
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
		<DropdownMenu.Group>
			<DropdownMenu.Label>My Account</DropdownMenu.Label>
			<DropdownMenu.Item>Profile</DropdownMenu.Item>
			<DropdownMenu.Item>Billing</DropdownMenu.Item>
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>GitHub</DropdownMenu.Item>
		<DropdownMenu.Item>Support</DropdownMenu.Item>
		<DropdownMenu.Item disabled>API</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
