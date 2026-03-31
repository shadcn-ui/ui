<script lang="ts">
	import { MediaQuery } from "svelte/reactivity";
	import * as Dialog from "$lib/registry/ui/dialog/index.js";
	import * as Drawer from "$lib/registry/ui/drawer/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
	import { Button, buttonVariants } from "$lib/registry/ui/button/index.js";

	let open = $state(false);
	const isDesktop = new MediaQuery("(min-width: 768px)");

	const id = $props.id();
</script>

{#if isDesktop.current}
	<Dialog.Root bind:open>
		<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Edit Profile</Dialog.Trigger>
		<Dialog.Content class="sm:max-w-[425px]">
			<Dialog.Header>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done.
				</Dialog.Description>
			</Dialog.Header>
			<form class="grid items-start gap-4">
				<div class="grid gap-2">
					<Label for="email-{id}">Email</Label>
					<Input type="email" id="email-{id}" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="username-{id}">Username</Label>
					<Input id="username-{id}" value="@shadcn" />
				</div>
				<Button type="submit">Save changes</Button>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger class={buttonVariants({ variant: "outline" })}>Edit Profile</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header class="text-start">
				<Drawer.Title>Edit profile</Drawer.Title>
				<Drawer.Description>
					Make changes to your profile here. Click save when you're done.
				</Drawer.Description>
			</Drawer.Header>
			<form class="grid items-start gap-4 px-4">
				<div class="grid gap-2">
					<Label for="email-{id}">Email</Label>
					<Input type="email" id="email-{id}" value="shadcn@example.com" />
				</div>
				<div class="grid gap-2">
					<Label for="username-{id}">Username</Label>
					<Input id="username-{id}" value="@shadcn" />
				</div>
				<Button type="submit">Save changes</Button>
			</form>
			<Drawer.Footer class="pt-2">
				<Drawer.Close class={buttonVariants({ variant: "outline" })}>Cancel</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
