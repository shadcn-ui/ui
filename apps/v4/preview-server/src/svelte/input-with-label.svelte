<script lang="ts">
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";

	const id = $props.id();
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="email-{id}">Email</Label>
	<Input type="email" id="email-{id}" placeholder="Email" />
</div>
