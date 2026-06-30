<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as InputGroup from "@/svelte-ui/input-group/index.js";
	import SearchIcon from "~icons/ms/search";
</script>

<Field.Field class="max-w-sm">
	<Field.Label for="inline-start-input">Input</Field.Label>
	<InputGroup.Root>
		<InputGroup.Input id="inline-start-input" placeholder="Search..." />
		<InputGroup.Addon align="inline-start">
			<SearchIcon class="text-muted-foreground" />
		</InputGroup.Addon>
	</InputGroup.Root>
	<Field.Description>Icon positioned at the start.</Field.Description>
</Field.Field>
