<script lang="ts">
	import { Button } from "@/svelte-ui/button/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
</script>

<div class="flex w-full max-w-sm items-center gap-2">
	<Input type="email" placeholder="Email" />
	<Button type="submit" variant="outline">Subscribe</Button>
</div>
