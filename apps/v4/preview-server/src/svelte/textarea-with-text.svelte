<script lang="ts">
	import { Label } from "@/svelte-ui/label/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<div class="grid w-full gap-1.5">
	<Label for="message-2">Your Message</Label>
	<Textarea placeholder="Type your message here." id="message-2" />
	<p class="text-muted-foreground text-sm">Your message will be copied to the support team.</p>
</div>
