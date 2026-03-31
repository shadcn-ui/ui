<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Slider } from "$lib/registry/ui/slider/index.js";

	let value = $state([200, 800]);
</script>

<div class="w-full max-w-md">
	<Field.Field>
		<Field.Label>Price Range</Field.Label>
		<Field.Description>
			Set your budget range ($<span class="font-medium tabular-nums">{value[0]}</span> -
			<span class="font-medium tabular-nums">{value[1]}</span>).
		</Field.Description>
		<Slider
			type="multiple"
			bind:value
			max={1000}
			min={0}
			step={10}
			class="mt-2 w-full"
			aria-label="Price Range"
		/>
	</Field.Field>
</div>
