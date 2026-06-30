<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "@/svelte-ui/button/index.js";
</script>

<div class="flex flex-wrap justify-center gap-2">
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "top-left" })}
	>
		Top Left
	</Button>
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "top-center" })}
	>
		Top Center
	</Button>
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "top-right" })}
	>
		Top Right
	</Button>
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "bottom-left" })}
	>
		Bottom Left
	</Button>
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "bottom-center" })}
	>
		Bottom Center
	</Button>
	<Button
		variant="outline"
		onclick={() => toast("Event has been created", { position: "bottom-right" })}
	>
		Bottom Right
	</Button>
</div>
