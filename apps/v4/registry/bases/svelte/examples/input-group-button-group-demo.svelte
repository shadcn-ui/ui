<script lang="ts">
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import * as Label from "$lib/registry/ui/label/index.js";
	import Link2Icon from "@lucide/svelte/icons/link-2";
</script>

<div class="grid w-full max-w-sm gap-6">
	<ButtonGroup.Root>
		<ButtonGroup.Text>
			<Label.Root for="url">https://</Label.Root>
		</ButtonGroup.Text>
		<InputGroup.Root>
			<InputGroup.Input id="url" />
			<InputGroup.Addon align="inline-end">
				<Link2Icon />
			</InputGroup.Addon>
		</InputGroup.Root>
		<ButtonGroup.Text>.com</ButtonGroup.Text>
	</ButtonGroup.Root>
</div>
