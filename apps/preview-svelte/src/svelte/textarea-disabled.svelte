<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Textarea } from "@/svelte-ui/textarea/index.js";
</script>

<Field.Field data-disabled>
	<Field.Label for="textarea-disabled">Message</Field.Label>
	<Textarea
		id="textarea-disabled"
		placeholder="Type your message here."
		disabled
	/>
</Field.Field>
