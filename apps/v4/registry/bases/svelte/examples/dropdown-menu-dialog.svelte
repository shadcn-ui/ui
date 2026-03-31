<script lang="ts">
	import MoreHorizontal from "@lucide/svelte/icons/more-horizontal";

	import { Button, buttonVariants } from "$lib/registry/ui/button/index.js";
	import * as Dialog from "$lib/registry/ui/dialog/index.js";
	import * as DropdownMenu from "$lib/registry/ui/dropdown-menu/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
	import { Textarea } from "$lib/registry/ui/textarea/index.js";
	import * as Field from "$lib/registry/ui/field/index.js";

	let showNewDialog = $state(false);
	let showShareDialog = $state(false);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: "outline", size: "icon-sm" })}>
		<MoreHorizontal />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-40" align="end">
		<DropdownMenu.Label>File Actions</DropdownMenu.Label>
		<DropdownMenu.Group>
			<DropdownMenu.Item onSelect={() => (showNewDialog = true)}>
				New File...
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={() => (showShareDialog = true)}>
				Share...
			</DropdownMenu.Item>
			<DropdownMenu.Item disabled>Download</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<Dialog.Root bind:open={showNewDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Create New File</Dialog.Title>
			<Dialog.Description>
				Provide a name for your new file. Click create when you&apos;re done.
			</Dialog.Description>
		</Dialog.Header>
		<Field.Group class="pb-3">
			<Field.Field>
				<Field.Label for="filename">File Name</Field.Label>
				<Input id="filename" name="filename" placeholder="document.txt" />
			</Field.Field>
		</Field.Group>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
			<Button type="submit">Create</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={showShareDialog}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Share File</Dialog.Title>
			<Dialog.Description>
				Anyone with the link will be able to view this file.
			</Dialog.Description>
		</Dialog.Header>
		<Field.Group class="py-3">
			<Field.Field>
				<Label for="email">Email Address</Label>
				<Input id="email" name="email" type="email" placeholder="shadcn@vercel.com" />
			</Field.Field>
			<Field.Field>
				<Field.Label for="message">Message (Optional)</Field.Label>
				<Textarea id="message" name="message" placeholder="Check out this file" />
			</Field.Field>
		</Field.Group>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "outline" })}>Cancel</Dialog.Close>
			<Button type="submit">Send Invite</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
