<script lang="ts">
	import * as Field from "$lib/registry/ui/field/index.js";
	import { Textarea } from "$lib/registry/ui/textarea/index.js";
</script>

<div class="w-full max-w-md">
	<Field.Set>
		<Field.Group>
			<Field.Field>
				<Field.Label for="feedback">Feedback</Field.Label>
				<Textarea id="feedback" placeholder="Your feedback helps us improve..." rows={4} />
				<Field.Description>Share your thoughts about our service.</Field.Description>
			</Field.Field>
		</Field.Group>
	</Field.Set>
</div>
