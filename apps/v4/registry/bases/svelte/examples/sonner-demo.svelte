<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<Button
	variant="outline"
	onclick={() =>
		toast("Event has been created", {
			description: "Sunday, December 03, 2023 at 9:00 AM",
			action: {
				label: "Undo",
				onClick: () => console.info("Undo"),
			},
		})}
>
	Show Toast
</Button>
