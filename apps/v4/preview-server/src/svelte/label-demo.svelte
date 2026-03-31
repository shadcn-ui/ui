<script lang="ts">
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
	import { Label } from "@/svelte-ui/label/index.js";
</script>

<div>
	<div class="flex items-center space-x-2">
		<Checkbox id="terms" />
		<Label for="terms">Accept terms and conditions</Label>
	</div>
</div>
