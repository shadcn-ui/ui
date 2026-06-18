<script lang="ts">
	import { InputGroup, InputGroupInput } from "@/svelte-ui/input-group/index.js";
</script>

<div class="flex w-full flex-col gap-4">
	<InputGroup variant="outline">
		<InputGroupInput placeholder="Outline" />
	</InputGroup>
	<InputGroup variant="filled">
		<InputGroupInput placeholder="Filled" />
	</InputGroup>
	<InputGroup variant="underline">
		<InputGroupInput placeholder="Underline" />
	</InputGroup>
	<InputGroup variant="ghost">
		<InputGroupInput placeholder="Ghost" />
	</InputGroup>
</div>
