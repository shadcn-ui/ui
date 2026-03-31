<script lang="ts">
	import { Input } from "$lib/registry/ui/input/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="email-2">Email</Label>
	<Input type="email" id="email-2" placeholder="Email" />
	<p class="text-muted-foreground text-sm">Enter your email address.</p>
</div>
