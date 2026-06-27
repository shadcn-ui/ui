<script lang="ts">
	import { Label } from "@/svelte-ui/label/index.js";
	import { Slider } from "@/svelte-ui/slider/index.js";

	let value = $state(30);
</script>

<div class="mx-auto grid w-full max-w-xs gap-3">
	<div class="flex items-center justify-between gap-2">
		<Label for="slider-controlled-temperature">Temperature</Label>
		<span class="text-sm text-muted-foreground">{value}</span>
	</div>
	<Slider
		id="slider-controlled-temperature"
		type="single"
		bind:value
		min={0}
		max={100}
		step={1}
	/>
</div>
