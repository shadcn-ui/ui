<script lang="ts">
	import { Label } from "@/svelte-ui/label/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
	<Label for="message">Your message</Label>
	<Textarea placeholder="Type your message here." id="message" />
</div>
