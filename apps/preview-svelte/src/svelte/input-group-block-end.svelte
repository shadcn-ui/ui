<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as InputGroup from "@/svelte-ui/input-group/index.js";
</script>

<Field.Group class="max-w-sm">
	<Field.Field>
		<Field.Label for="block-end-input">Input</Field.Label>
		<InputGroup.Root class="h-auto">
			<InputGroup.Input id="block-end-input" placeholder="Enter amount" />
			<InputGroup.Addon align="block-end">
				<InputGroup.Text>USD</InputGroup.Text>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Field.Description>Footer positioned below the input.</Field.Description>
	</Field.Field>
	<Field.Field>
		<Field.Label for="block-end-textarea">Textarea</Field.Label>
		<InputGroup.Root>
			<InputGroup.Textarea id="block-end-textarea" placeholder="Write a comment..." />
			<InputGroup.Addon align="block-end">
				<InputGroup.Text>0/280</InputGroup.Text>
				<InputGroup.Button variant="default" size="sm" class="ml-auto">
					Post
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Field.Description>Footer positioned below the textarea.</Field.Description>
	</Field.Field>
</Field.Group>
