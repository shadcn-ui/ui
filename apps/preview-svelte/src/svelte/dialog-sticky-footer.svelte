<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Dialog from "@/svelte-ui/dialog/index.js";
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: "outline" })}>Sticky Footer</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Sticky Footer</Dialog.Title>
			<Dialog.Description>
				This dialog has a sticky footer that stays visible while the content scrolls.
			</Dialog.Description>
		</Dialog.Header>
		<div class="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
			{#each Array.from({ length: 10 }) as _, index}
				<p class="mb-4 leading-normal">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
					eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
					enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat
					nulla pariatur. Excepteur sint occaecat cupidatat non proident,
					sunt in culpa qui officia deserunt mollit anim id est laborum.
				</p>
			{/each}
		</div>
		<Dialog.Footer>
			<Dialog.Close class={buttonVariants({ variant: "outline" })}>Close</Dialog.Close>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
