<script lang="ts">
	import { Input } from "@/svelte-ui/input/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<div class="grid w-full max-w-sm items-center gap-1.5">
	<Label for="picture">Picture</Label>
	<Input id="picture" type="file" />
</div>
