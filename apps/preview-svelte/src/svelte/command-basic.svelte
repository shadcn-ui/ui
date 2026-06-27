<script lang="ts">
	import * as Command from "@/svelte-ui/command/index.js";
	import { Button } from "@/svelte-ui/button/index.js";

	let open = $state(false);
</script>

<div class="flex flex-col gap-4">
	<Button onclick={() => (open = true)} variant="outline" class="w-fit">
		Open Menu
	</Button>
	<Command.Dialog bind:open>
		<Command.Input placeholder="Type a command or search..." />
		<Command.List>
			<Command.Empty>No results found.</Command.Empty>
			<Command.Group heading="Suggestions">
				<Command.Item>Calendar</Command.Item>
				<Command.Item>Search Emoji</Command.Item>
				<Command.Item>Calculator</Command.Item>
			</Command.Group>
		</Command.List>
	</Command.Dialog>
</div>
