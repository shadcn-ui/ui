<script lang="ts">
	import * as ContextMenu from "@/svelte-ui/context-menu/index.js";

	let user = $state("pedro");
	let theme = $state("light");
</script>

<ContextMenu.Root>
	<ContextMenu.Trigger
		class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm"
	>
		Right click here
	</ContextMenu.Trigger>
	<ContextMenu.Content>
		<ContextMenu.Group>
			<ContextMenu.Label>People</ContextMenu.Label>
			<ContextMenu.RadioGroup bind:value={user}>
				<ContextMenu.RadioItem value="pedro">Pedro Duarte</ContextMenu.RadioItem>
				<ContextMenu.RadioItem value="colm">Colm Tuite</ContextMenu.RadioItem>
			</ContextMenu.RadioGroup>
		</ContextMenu.Group>
		<ContextMenu.Separator />
		<ContextMenu.Group>
			<ContextMenu.Label>Theme</ContextMenu.Label>
			<ContextMenu.RadioGroup bind:value={theme}>
				<ContextMenu.RadioItem value="light">Light</ContextMenu.RadioItem>
				<ContextMenu.RadioItem value="dark">Dark</ContextMenu.RadioItem>
				<ContextMenu.RadioItem value="system">System</ContextMenu.RadioItem>
			</ContextMenu.RadioGroup>
		</ContextMenu.Group>
	</ContextMenu.Content>
</ContextMenu.Root>
