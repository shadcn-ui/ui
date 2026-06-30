<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as InputGroup from "@/svelte-ui/input-group/index.js";
	import CopyIcon from "~icons/ms/content_copy";
	import FileCodeIcon from "~icons/ms/code";
</script>

<Field.Group class="max-w-sm">
	<Field.Field>
		<Field.Label for="block-start-input">Input</Field.Label>
		<InputGroup.Root class="h-auto">
			<InputGroup.Input id="block-start-input" placeholder="Enter your name" />
			<InputGroup.Addon align="block-start">
				<InputGroup.Text>Full Name</InputGroup.Text>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Field.Description>Header positioned above the input.</Field.Description>
	</Field.Field>
	<Field.Field>
		<Field.Label for="block-start-textarea">Textarea</Field.Label>
		<InputGroup.Root>
			<InputGroup.Textarea
				id="block-start-textarea"
				placeholder="console.log('Hello, world!');"
				class="font-mono text-sm"
			/>
			<InputGroup.Addon align="block-start">
				<FileCodeIcon class="text-muted-foreground" />
				<InputGroup.Text class="font-mono">script.js</InputGroup.Text>
				<InputGroup.Button size="icon-xs" class="ml-auto">
					<CopyIcon />
					<span class="sr-only">Copy</span>
				</InputGroup.Button>
			</InputGroup.Addon>
		</InputGroup.Root>
		<Field.Description>Header positioned above the textarea.</Field.Description>
	</Field.Field>
</Field.Group>
