<script lang="ts">
	import { buttonVariants } from "$lib/registry/ui/button/index.js";
	import * as Dialog from "$lib/registry/ui/dialog/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Share</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Share link</Dialog.Title>
			<Dialog.Description>
				Anyone who has this link will be able to view this.
			</Dialog.Description>
		</Dialog.Header>
		<div class="flex items-center gap-2">
			<div class="grid flex-1 gap-2">
				<Label for="link" class="sr-only">Link</Label>
				<Input id="link" defaultValue="https://shadcn-svelte.com/docs/installation" />
			</div>
		</div>
		<Dialog.Footer class="sm:justify-start">
			<Dialog.Close class={buttonVariants({ variant: "secondary" })}>Close</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
