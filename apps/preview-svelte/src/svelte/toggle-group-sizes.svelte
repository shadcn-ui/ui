<script lang="ts">
	import * as ToggleGroup from "@/svelte-ui/toggle-group/index.js";
</script>

<div class="flex flex-col gap-4">
	<ToggleGroup.Root type="single" size="sm" defaultValue="top" variant="outline">
		<ToggleGroup.Item value="top" aria-label="Toggle top">Top</ToggleGroup.Item>
		<ToggleGroup.Item value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroup.Item>
		<ToggleGroup.Item value="left" aria-label="Toggle left">Left</ToggleGroup.Item>
		<ToggleGroup.Item value="right" aria-label="Toggle right">Right</ToggleGroup.Item>
	</ToggleGroup.Root>
	<ToggleGroup.Root type="single" defaultValue="top" variant="outline">
		<ToggleGroup.Item value="top" aria-label="Toggle top">Top</ToggleGroup.Item>
		<ToggleGroup.Item value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroup.Item>
		<ToggleGroup.Item value="left" aria-label="Toggle left">Left</ToggleGroup.Item>
		<ToggleGroup.Item value="right" aria-label="Toggle right">Right</ToggleGroup.Item>
	</ToggleGroup.Root>
</div>
