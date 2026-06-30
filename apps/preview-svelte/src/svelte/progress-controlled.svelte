<script lang="ts">
	import { Progress } from "@/svelte-ui/progress/index.js";
	import { Slider } from "@/svelte-ui/slider/index.js";

	let value = $state(50);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
	<Progress {value} max={100} />
	<Slider type="single" bind:value min={0} max={100} step={1} />
</div>
