<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<Field.Field data-invalid>
	<Field.Label for="textarea-invalid">Message</Field.Label>
	<Textarea
		id="textarea-invalid"
		placeholder="Type your message here."
		aria-invalid
	/>
	<Field.Description>Please enter a valid message.</Field.Description>
</Field.Field>
