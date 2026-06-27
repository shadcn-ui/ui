<script lang="ts">
	import { toast } from "svelte-sonner";
	import { Button } from "@/svelte-ui/button/index.js";
</script>

<Button
	variant="outline"
	class="w-fit"
	onclick={() =>
		toast("Event has been created", {
			description: "Monday, January 3rd at 6:00pm",
		})}
>
	Show Toast
</Button>
