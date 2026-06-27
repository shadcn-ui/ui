<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as ToggleGroup from "@/svelte-ui/toggle-group/index.js";

	let fontWeight = $state("normal");
</script>

<Field.Field>
	<Field.Label>Font Weight</Field.Label>
	<ToggleGroup.Root
		type="single"
		value={fontWeight}
		onValueChange={(value) => (fontWeight = value)}
		variant="outline"
		spacing={2}
		size="lg"
	>
		<ToggleGroup.Item
			value="light"
			aria-label="Light"
			class="flex size-16 flex-col items-center justify-center rounded-xl"
		>
			<span class="text-2xl leading-none font-light">Aa</span>
			<span class="text-xs text-muted-foreground">Light</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="normal"
			aria-label="Normal"
			class="flex size-16 flex-col items-center justify-center rounded-xl"
		>
			<span class="text-2xl leading-none font-normal">Aa</span>
			<span class="text-xs text-muted-foreground">Normal</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="medium"
			aria-label="Medium"
			class="flex size-16 flex-col items-center justify-center rounded-xl"
		>
			<span class="text-2xl leading-none font-medium">Aa</span>
			<span class="text-xs text-muted-foreground">Medium</span>
		</ToggleGroup.Item>
		<ToggleGroup.Item
			value="bold"
			aria-label="Bold"
			class="flex size-16 flex-col items-center justify-center rounded-xl"
		>
			<span class="text-2xl leading-none font-bold">Aa</span>
			<span class="text-xs text-muted-foreground">Bold</span>
		</ToggleGroup.Item>
	</ToggleGroup.Root>
	<Field.Description>
		Use <code class="rounded-md bg-muted px-1 py-0.5 font-mono">font-{fontWeight}</code> to set the font weight.
	</Field.Description>
</Field.Field>
