<script lang="ts">
	import { buttonVariants } from "@/svelte-ui/button/index.js";
	import * as Field from "@/svelte-ui/field/index.js";
	import { Input } from "@/svelte-ui/input/index.js";
	import * as Popover from "@/svelte-ui/popover/index.js";
</script>

<Popover.Root>
	<Popover.Trigger class={buttonVariants({ variant: "outline" })}>Open Popover</Popover.Trigger>
	<Popover.Content class="w-64" align="start">
		<Popover.Header>
			<Popover.Title>Dimensions</Popover.Title>
			<Popover.Description>Set the dimensions for the layer.</Popover.Description>
		</Popover.Header>
		<Field.Group class="gap-4">
			<Field.Field orientation="horizontal">
				<Field.Label for="width" class="w-1/2">Width</Field.Label>
				<Input id="width" value="100%" />
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Field.Label for="height" class="w-1/2">Height</Field.Label>
				<Input id="height" value="25px" />
			</Field.Field>
		</Field.Group>
	</Popover.Content>
</Popover.Root>
