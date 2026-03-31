<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/registry/ui/button/index.js";
</script>

<div class="flex flex-wrap gap-2">
	<Button variant="outline" onclick={() => toast("Event has been created")}>Default</Button>
	<Button variant="outline" onclick={() => toast.success("Event has been created")}>
		Success
	</Button>
	<Button
		variant="outline"
		onclick={() => toast.info("Be at the area 10 minutes before the event time")}
	>
		Info
	</Button>
	<Button
		variant="outline"
		onclick={() => toast.warning("Event start time cannot be earlier than 8am")}
	>
		Warning
	</Button>
	<Button variant="outline" onclick={() => toast.error("Event has not been created")}>
		Error
	</Button>
	<Button
		variant="outline"
		onclick={() => {
			toast.promise<{ name: string }>(
				() => new Promise((resolve) => setTimeout(() => resolve({ name: "Event" }), 2000)),
				{
					loading: "Loading...",
					success: (data) => `${data.name} has been created`,
					error: "Error",
				}
			);
		}}
	>
		Promise
	</Button>
</div>
