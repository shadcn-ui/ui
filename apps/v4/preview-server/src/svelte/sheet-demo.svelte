<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import * as Sheet from "@/svelte-ui/sheet/index.js";
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: "outline" })}>Open</Sheet.Trigger>
	<Sheet.Content side="right">
		<Sheet.Header>
			<Sheet.Title>Edit profile</Sheet.Title>
			<Sheet.Description>
				Make changes to your profile here. Click save when you're done.
			</Sheet.Description>
		</Sheet.Header>
		<div class="grid flex-1 auto-rows-min gap-6 px-4">
			<div class="grid gap-3">
				<Label for="name" class="text-end">Name</Label>
				<Input id="name" value="Pedro Duarte" />
			</div>
			<div class="grid gap-3">
				<Label for="username" class="text-end">Username</Label>
				<Input id="username" value="@peduarte" />
			</div>
		</div>
		<Sheet.Footer>
			<Button type="submit">Save changes</Button>
			<Sheet.Close class={buttonVariants({ variant: "outline" })}>Close</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>
