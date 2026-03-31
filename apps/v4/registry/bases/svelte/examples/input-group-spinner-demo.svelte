<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import { Spinner } from "$lib/registry/ui/spinner/index.js";
	import LoaderIcon from "@lucide/svelte/icons/loader";
</script>

<div class="grid w-full max-w-sm gap-4">
	<InputGroup.Root data-disabled>
		<InputGroup.Input placeholder="Searching..." disabled />
		<InputGroup.Addon align="inline-end">
			<Spinner />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root data-disabled>
		<InputGroup.Input placeholder="Processing..." disabled />
		<InputGroup.Addon>
			<Spinner />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root data-disabled>
		<InputGroup.Input placeholder="Saving changes..." disabled />
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text>Saving...</InputGroup.Text>
			<Spinner />
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root data-disabled>
		<InputGroup.Input placeholder="Refreshing data..." disabled />
		<InputGroup.Addon>
			<LoaderIcon class="animate-spin" />
		</InputGroup.Addon>
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text class="text-muted-foreground">Please wait...</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
