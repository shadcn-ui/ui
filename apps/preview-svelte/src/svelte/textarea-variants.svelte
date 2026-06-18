<script lang="ts">
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<div class="flex w-full flex-col gap-4">
	<Textarea variant="outline" placeholder="Outline" />
	<Textarea variant="filled" placeholder="Filled" />
	<Textarea variant="underline" placeholder="Underline" />
	<Textarea variant="ghost" placeholder="Ghost" />
</div>
