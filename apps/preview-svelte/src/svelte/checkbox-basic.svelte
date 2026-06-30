<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import { Checkbox } from "@/svelte-ui/checkbox/index.js";
</script>

<Field.Group class="mx-auto w-56">
	<Field.Field orientation="horizontal">
		<Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" />
		<Field.Label for="terms-checkbox-basic">
			Accept terms and conditions
		</Field.Label>
	</Field.Field>
</Field.Group>
