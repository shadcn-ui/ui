<script lang="ts">
	import { Checkbox } from "$lib/registry/ui/checkbox/index.js";
	import { Label } from "$lib/registry/ui/label/index.js";
</script>

<div class="items-top flex space-x-2">
	<Checkbox id="terms1" />
	<div class="grid gap-1.5 leading-none">
		<Label
			for="terms1"
			class="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
		>
			Accept terms and conditions
		</Label>
		<p class="text-muted-foreground text-sm">
			You agree to our Terms of Service and Privacy Policy.
		</p>
	</div>
</div>
