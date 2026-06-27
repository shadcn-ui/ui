<script lang="ts">
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
					<Avatar.Fallback>CN</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-32">
		<DropdownMenu.Group>
			<DropdownMenu.Item>Profile</DropdownMenu.Item>
			<DropdownMenu.Item>Billing</DropdownMenu.Item>
			<DropdownMenu.Item>Settings</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item variant="destructive">Log out</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
