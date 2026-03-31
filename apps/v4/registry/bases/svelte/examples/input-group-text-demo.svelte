<script lang="ts">
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
</script>

<div class="grid w-full max-w-sm gap-6">
	<InputGroup.Root>
		<InputGroup.Addon>
			<InputGroup.Text>$</InputGroup.Text>
		</InputGroup.Addon>
		<InputGroup.Input placeholder="0.00" />
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text>USD</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Addon>
			<InputGroup.Text>https://</InputGroup.Text>
		</InputGroup.Addon>
		<InputGroup.Input placeholder="example.com" class="!ps-0.5" />
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text>.com</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Input placeholder="Enter your username" />
		<InputGroup.Addon align="inline-end">
			<InputGroup.Text>@company.com</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>
	<InputGroup.Root>
		<InputGroup.Textarea placeholder="Enter your message" />
		<InputGroup.Addon align="block-end">
			<InputGroup.Text class="text-muted-foreground text-xs">
				120 characters left
			</InputGroup.Text>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
