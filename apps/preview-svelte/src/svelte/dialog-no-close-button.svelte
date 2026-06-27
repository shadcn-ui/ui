<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Dialog from "@/svelte-ui/dialog/index.js";
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>No Close Button</Dialog.Trigger>
	<Dialog.Content showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title>No Close Button</Dialog.Title>
			<Dialog.Description>
				This dialog doesn't have a close button in the top-right corner.
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
